# frozen_string_literal: true

module Exporters
  class Mapping
    ###
    # @description: Manages to export a mapping to JSON-LD format to let the user download it.
    ###
    class JSONLD
      attr_reader :alignments, :mapping

      delegate :specification, :user, to: :mapping
      delegate :domain, to: :specification

      ###
      # @description: Initializes this class with the mapping to export.
      ###
      def initialize(mapping)
        @alignments = mapping
                        .alignments
                        .includes(
                          :predicate,
                          mapped_terms: [:property, { specifications: :domain }],
                          spine_term: [:property, { specifications: :domain }]
                        )

        @mapping = mapping
      end

      ###
      # @description: Merges nodes with the same `@id` into a single node
      #   by joining distinct values of identical properties into an array.
      ###
      def self.deduplicate(nodes)
        nodes.group_by { _1.fetch(:@id) }.values.map do |group|
          group.reduce do |acc, hash|
            acc.merge(hash) do |_, old_value, new_value|
              next old_value if old_value == new_value

              [old_value, new_value].flat_map { Array.wrap(_1) }.uniq
            end
          end
        end
      end

      ###
      # @description: Exports the mapping into json-ld format.
      ###
      def export
        { "@context": Desm::CONTEXT_URI, "@graph": graph }
      end

      def graph
        @graph ||= begin
          term_mapping_nodes = alignments.flat_map { term_nodes(_1) }
          nodes = [*abstract_class_mapping_nodes, *term_mapping_nodes]
          clean_nodes = deep_clean(nodes)
          expanded_nodes = clean_nodes.map { expand_uri_values(_1) }
          self.class.deduplicate(expanded_nodes)
        end
      end

      ###
      # @description: Specifies the format the main node (the node that represents the mapping itself)
      #  should have.
      ###
      def abstract_class_mapping_nodes
        [
          {
            "@id": mapping_uri,
            "@type": "desm:AbstractClassMapping",
            "dcterms:title": mapping.title,
            "dcterms:description": mapping.description,
            "dcterms:created": mapping.created_at.strftime("%F"),
            "dcterms:dateModified": mapping.updated_at.strftime("%F"),
            "desm:abstractClassModeled": { "@id": domain.source_uri },
            "dcterms:hasPart": alignments.map { { "@id": alignment_uri(_1) } }
          },
          domain_node(domain)
        ]
      end

      ###
      # @description: For each alignment to a spine term, we build basically 3 nodes, one ofr the
      #   alignment, one for the mapped property (more than one if there are many), and the last one
      #   for the spine property.
      ###
      def term_nodes(alignment)
        [
          alignment_node(alignment),
          predicate_node(alignment.predicate),
          *alignment.mapped_terms.flat_map do |term|
            property_nodes(alignment, term)
          end,
          *property_nodes(alignment, alignment.spine_term)
        ].flatten
      end

      ###
      # @description: Specifies the format the alignment node should have.
      ###
      def alignment_node(alignment)
        {
          "@id": alignment_uri(alignment),
          "@type": "desm:TermMapping",
          "dcterms:isPartOf": { "@id": mapping_uri },
          "desm:comment": alignment.comment,
          "dct:created": alignment.created_at.strftime("%F"),
          "dct:dateModified": alignment.updated_at.strftime("%F"),
          "desm:mappedTerm": alignment.mapped_terms.map do |term|
            { "@id": term_uri(term) }
          end,
          "desm:mappingPredicate": { "@id": alignment.predicate&.source_uri },
          "desm:spineTerm": { "@id": term_uri(alignment.spine_term) }
        }
      end

      def domain_node(domain)
        {
          "@id": domain.source_uri,
          "@type": "skos:Concept",
          "skos:prefLabel": domain.pref_label,
          "skos:definition": domain.definition
        }
      end

      ###
      # @description: Returns the compact versions of the term's domains
      #   as well as its full non-RDF domains
      ###
      def domain_nodes(term)
        (mapping.compact_domains(non_rdf: false) & term.compact_domains(non_rdf: false)).map do |domain|
          { "@id": domain }
        end
      end

      def range_nodes(term)
        term.compact_ranges.map { { "@id": _1 } }
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

      def predicate_node(predicate)
        return {} unless predicate

        {
          "@id": predicate.source_uri,
          "@type": "skos:Concept",
          "skos:prefLabel": predicate.pref_label,
          "skos:definition": predicate.definition,
          "skos:altLabel": nil
        }
      end

      ###
      # @description: Defines the structure of a generic property term.
      ###
      def property_nodes(alignment, term)
        property = term.property
        specification = term.specifications.first

        domain_includes =
          if term == alignment.spine_term
            { "@id": domain.source_uri }
          else
            domain_nodes(term)
          end

        [
          {
            "@id": term_uri(term),
            "@type": "rdf:Property",
            "rdfs:label": property.label,
            "desm:domainIncludes": domain_includes,
            "desm:inSchema": { "@id": specification_uri(specification) },
            "desm:rangeIncludes": range_nodes(term),
            "rdfs:comment": property.comment,
            "rdfs:subPropertyOf": ({ "@id": property.source_uri } unless property.source_path?),
            "desm:hasTermMapping": { "@id": alignment_uri(alignment) },
            "desm:sourcePath": property.source_path
          },
          specification_node(specification),
          agent_node
        ]
      end

      def specification_node(specification)
        return {} unless specification

        {
          "@id": specification_uri(specification),
          "@type": "desm:Schema",
          "dct:title": specification.name,
          "dct:has Version": specification.version,
          "desm:abstractClass": { "@id": domain.source_uri },
          "dct:creator": { "@id": agent_uri }
        }
      end

      def agent_node
        @agent_node ||= {
          "@id": agent_uri,
          "@type": "desm:Agent",
          "sdo:name": user.fullname,
          "desm:role": user.roles.pluck(:name),
          "sdo:email": user.email,
          "sdo:telephone": user.phone,
          "desm:githubHandle": user.github_handle
        }
      end

      private

      def agent_uri
        "#{Desm::APP_DOMAIN}/Agent/#{user.id}"
      end

      def alignment_uri(alignment)
        "#{Desm::APP_DOMAIN}/TermMapping/#{alignment.id}"
      end

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

      def expand_uri(value)
        return value if value.start_with?(%r{https?://})

        namespace, = value.split(":")
        uri = Desm::CONTEXT[namespace.to_sym]
        uri.present? ? value.sub("#{namespace}:", uri) : value
      end

      ###
      # @description: Recursively replaces values with namespaced URIs
      #   with full URIs according to the context.
      ###
      def expand_uri_values(nodes)
        nodes.transform_values do |value|
          case value
          when Array
            value.map { _1.is_a?(Hash) ? expand_uri_values(_1) : _1 }
          when Hash
            expand_uri_values(value)
          when String
            expand_uri(value)
          else
            value
          end
        end
      end

      def mapping_uri
        "#{Desm::APP_DOMAIN}/AbstractClassMapping/#{mapping.id}"
      end

      def specification_uri(specification)
        return unless specification

        "#{Desm::APP_DOMAIN}/Schema/#{specification.id}"
      end

      def term_uri(term)
        "#{Desm::APP_DOMAIN}/Property/#{term.id}"
      end
    end
  end
end
