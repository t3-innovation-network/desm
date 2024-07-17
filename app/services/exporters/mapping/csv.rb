# frozen_string_literal: true

module Exporters
  class Mapping
    class CSV
      HEADERS = [
        "Spine term name",
        "Spine term definition",
        "Spine term class/type",
        "Spine term range",
        "Spine term origin",
        "Mapping predicate label",
        "Mapping predicate definition",
        "Mapped term name",
        "Mapped term definition",
        "Mapped term class/type",
        "Mapped term range",
        "Mapped term origin",
        "Comments",
        "Transformation notes"
      ].freeze

      attr_reader :mapping

      def initialize(mapping)
        @mapping = mapping
      end

      class << self
        def term_domains(mapping, property)
          return unless property

          mapping_domains = mapping.compact_domains(non_rdf: false)
          property_domains = property.compact_domains(non_rdf: false)
          (mapping_domains & property_domains).join(" ")
        end

        def term_origin(term)
          specification = term.specifications.first
          version = "(#{specification.version})" if specification.version?
          [specification.name, version].compact.join(" ")
        end
      end

      def export
        ::CSV.generate do |csv|
          csv << HEADERS

          mapping.alignments.map do |alignment|
            Alignment.new(alignment).rows.each { csv << _1 }
          end
        end
      end

      class Alignment
        attr_reader :alignment

        delegate :mapping, :predicate, :spine_term, to: :alignment

        def initialize(alignment)
          @alignment = alignment
        end

        def mapped_terms
          # Passing a `nil` here if there are no mapped terms,
          # so empty cells will be generated
          alignment.mapped_terms.presence || [nil]
        end

        def organization
          alignment.spine_term.organization
        end

        def rows
          mapped_terms.map do |mapped_term|
            [
              # Spine term name
              spine_property.label,
              # Spine term definition
              spine_property.comments.join("\n"),
              # Spine term class/type
              CSV.term_domains(mapping, spine_property),
              # Spine term range
              spine_property.compact_ranges.join(", "),
              # Spine term origin
              CSV.term_origin(spine_term),
              # Mapping predicate label
              predicate&.name,
              # Mapping predicate definition
              predicate&.definition,
              *MappedTerm.new(mapping, mapped_term).values,
              # Comments
              alignment.comment,
              # Transformation notes
              nil
            ]
          end
        end

        def spine_property
          spine_term.property
        end
      end

      class MappedTerm
        attr_reader :mapping, :term

        delegate :property, to: :term

        def initialize(mapping, term)
          @mapping = mapping
          @term = term
        end

        def values
          return Array.new(4) unless term

          [
            # Mapped term name
            property.label,
            # Mapped term definition
            property.comments&.join("\n"),
            # Mapped term class/type
            CSV.term_domains(mapping, property),
            # Mapped term range
            property.compact_ranges.join(", "),
            # Mapped term origin
            CSV.term_origin(term)
          ]
        end
      end
    end
  end
end
