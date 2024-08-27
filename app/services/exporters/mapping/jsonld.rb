# frozen_string_literal: true

module Exporters
  class Mapping
    ###
    # @description: Manages to export a mapping to JSON-LD format to let the user download it.
    ###
    class JSONLD
      attr_reader :mapping

      ###
      # @description: Initializes this class with the mapping to export.
      ###
      def initialize(mapping)
        @mapping = mapping
      end

      ###
      # @description: Exports the mapping into json-ld format.
      ###
      def export
        { "@context": Desm::CONTEXT, "@graph": graph }
      end

      def graph
        @graph ||= begin
          nodes = mapping.alignments.map do |alignment|
            term_nodes(alignment)
          end.flatten.unshift(main_node)

          deep_clean(nodes)
        end
      end

      ###
      # @description: Specifies the format the main node (the node that represents the mapping itself)
      #  should have.
      ###
      def main_node
        {
          "@id": mapping_uri,
          "@type": "desm:AbstractClassMapping",
          "dcterms:created": mapping.created_at.strftime("%F"),
          "dcterms:dateModified": mapping.updated_at.strftime("%F"),
          "dcterms:title": mapping.title,
          # @todo: Where to take this from
          "dcterms:description": "",
          "desm:abstractClassMapped": { "@id": mapping.specification.domain.uri },
          "dcterms:hasPart": mapping.alignments.map do |alignment|
            { "@id": alignment.uri }
          end
        }
      end

      ###
      # @description: For each alignment to a spine term, we build basically 3 nodes, one ofr the
      #   alignment, one for the mapped property (more than one if there are many), and the last one
      #   for the spine property.
      ###
      def term_nodes(alignment)
        [
          alignment_node(alignment),
          alignment.mapped_terms.map { |term| property_node(term) },
          property_node(alignment.spine_term)
        ].flatten
      end

      ###
      # @description: Specifies the format the alignment node should have.
      ###
      def alignment_node(alignment)
        {
          "@id": alignment.uri,
          "@type": "desm:TermMapping",
          "dcterms:isPartOf": { "@id": mapping_uri },
          "desm:comment": alignment.comment,
          "desm:mappedterm": alignment.mapped_terms.map do |mapped_term|
            { "@id": mapped_term.uri }
          end,
          "desm:mappingPredicate": { "@id": alignment.predicate&.uri },
          "desm:spineTerm": { "@id": alignment.spine_term.uri }
        }
      end

      ###
      # @description: Returns the compact versions of the term's domains
      #   as well as its full non-RDF domains
      ###
      def domain_nodes(term)
        mapping.compact_domains(non_rdf: false) & term.compact_domains(non_rdf: false)
      end

      ###
      # @description: Parses the subproperty's value which is a stringified hash
      #   as well as its full non-RDF domains
      ###
      def parse_subproperty_of(value)
        YAML.load(value.gsub("=>", ": ")) if value
      rescue StandardError
        value
      end

      ###
      # @description: Defines the structure of a generic property term.
      ###
      def property_node(term)
        {
          "@id": term.source_uri,
          "@type": "rdf:Property",
          "desm:sourceURI": { "@id": term.property.source_uri },
          "rdfs:subPropertyOf": parse_subproperty_of(term.property.subproperty_of),
          "desm:valueSpace": { "@id": term.property.value_space },
          "rdfs:label": term.property.label,
          "rdfs:comment": term.property.comment,
          "desm:domainIncludes": domain_nodes(term),
          "desm:rangeIncludes": term.compact_ranges
        }
      end

      private

      ###
      # @description: Recursively removes all blank values from an enumerable node
      ###
      def deep_clean(node)
        case node
        when Array
          node.map { deep_clean(_1) }.select(&:presence)
        when Hash
          node.each_with_object({}) do |(key, value), clean_node|
            clean_value = deep_clean(value)
            next unless clean_value.presence

            clean_node[key] = clean_value
          end
        else
          node
        end
      end

      def mapping_uri
        "http://desmsolutions.org/TermMapping/#{mapping.id}"
      end
    end
  end
end
