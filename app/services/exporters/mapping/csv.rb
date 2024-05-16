# frozen_string_literal: true

module Exporters
  class Mapping
    class CSV
      HEADERS = [
        "Spine term name",
        "Spine term definition",
        "Spine term class/type",
        "Spine term organization+schema",
        "Mapping predicate label",
        "Mapping predicate definition",
        "Mapped term name",
        "Mapped term definition",
        "Mapped term class type",
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
        mapping
          .alignments
          .includes(
            :predicate,
            mapped_terms: :property,
            spine_term: %i(organization property specifications)
          )
      end

      class Row
        attr_reader :alignment

        delegate :predicate, to: :alignment

        def initialize(alignment)
          @alignment = alignment
        end

        def mapped_term
          alignment.mapped_terms.first&.property
        end

        def organization
          alignment.spine_term.organization
        end

        def specification
          alignment.spine_term.specifications.first
        end

        def spine_term
          alignment.spine_term.property
        end

        def values
          [
            spine_term.label,
            spine_term.comment,
            spine_term.selected_range,
            [organization.name, specification.name].compact.join("+"),
            predicate&.name,
            predicate&.definition,
            mapped_term&.label,
            mapped_term&.comment,
            mapped_term&.selected_range,
            alignment.comment,
            nil
          ]
        end
      end
    end
  end
end
