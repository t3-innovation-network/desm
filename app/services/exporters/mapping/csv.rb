# frozen_string_literal: true

module Exporters
  class Mapping
    class CSV
      HEADERS = [
        "Spine term name",
        "Spine term definition",
        "Spine term class/type",
        "Spine term origin",
        "Mapping predicate label",
        "Mapping predicate definition",
        "Mapped term name",
        "Mapped term definition",
        "Mapped term class/type",
        "Mapped term origin",
        "Comments",
        "Transformation notes"
      ].freeze

      attr_reader :mapping

      def initialize(mapping)
        @mapping = mapping
      end

      def export
        ::CSV.generate do |csv|
          csv << HEADERS
          alignments.map { csv << Row.new(_1).values }
        end
      end

      def alignments
        mapping.alignments
      end

      class Row
        attr_reader :alignment

        delegate :mapping, :predicate, to: :alignment

        def initialize(alignment)
          @alignment = alignment
        end

        def mapped_term
          alignment.mapped_terms.first&.property
        end

        def mapped_term_specification
          alignment.mapped_terms.first&.specifications&.first
        end

        def mapped_term_specification_version
          "(#{mapped_term_specification.version})" if mapped_term_specification&.version?
        end

        def organization
          alignment.spine_term.organization
        end

        def spine_term
          alignment.spine_term.property
        end

        def spine_term_specification
          alignment.spine_term.specifications.first
        end

        def spine_term_specification_version
          "(#{spine_term_specification.version})" if spine_term_specification.version?
        end

        def term_domains(term)
          return unless term

          domains = mapping.compact_domains(non_rdf: false) & term.compact_domains(non_rdf: false)
          domains.join(" ")
        end

        def values
          [
            # Spine term name
            spine_term.label,
            # Spine term definition
            spine_term.comments.join("\n"),
            # Spine term class/type
            term_domains(spine_term),
            # Spine term origin
            [spine_term_specification.name, spine_term_specification_version].compact.join(" "),
            # Mapping predicate label
            predicate&.name,
            # Mapping predicate definition
            predicate&.definition,
            # Mapped term name
            mapped_term&.label,
            # Mapped term definition
            mapped_term&.comments&.join("\n"),
            # Mapped term class/type
            term_domains(mapped_term),
            # Mapped term origin
            [mapped_term_specification&.name, mapped_term_specification_version].compact.join(" "),
            # Comments
            alignment.comment,
            # Transformation notes
            nil
          ]
        end
      end
    end
  end
end
