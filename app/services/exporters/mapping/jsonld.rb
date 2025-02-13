# frozen_string_literal: true

module Exporters
  class Mapping
    ###
    # @description: Manages to export a mapping to JSON-LD format to let the user download it.
    ###
    class JSONLD
      attr_reader :mapping

      delegate :specification, :user, to: :mapping
      delegate :domain, to: :specification

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
          alignments = mapping
                         .alignments
                         .includes(
                           :predicate,
                           mapped_terms: [:property, { specifications: :domain }],
                           spine_term: [:property, { specifications: :domain }]
                         )

          term_mapping_nodes = alignments.flat_map do |alignment|
            term_nodes(alignment)
          end

          nodes = [*abstract_class_mapping_nodes, *term_mapping_nodes]
          deep_clean(nodes)
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
            "desm:abstractClassModeled": { "@id": domain.uri },
            "dcterms:hasPart": mapping.alignments.map do |alignment|
              { "@id": alignment_uri(alignment) }
            end
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
          "desm:created": alignment.created_at.strftime("%F"),
          "desm:dateModified": alignment.updated_at.strftime("%F"),
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
          "skos: definition": domain.definition,
          "skos:altLabel": nil
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

      def predicate_node(predicate)
        return {} unless predicate

        {
          "@id": predicate.source_uri,
          "@type": "skos:Concept",
          "skos:prefLabel": predicate.pref_label,
          "skos: definition": predicate.definition,
          "skos:altLabel": nil
        }
      end

      ###
      # @description: Defines the structure of a generic property term.
      ###
      def property_nodes(alignment, term)
        specification = term.specifications.first

        [
          {
            "@id": term_uri(term),
            "@type": "rdf:Property",
            "desm:sourceURI": { "@id": term.property.source_uri },
            "rdfs:subPropertyOf": term.raw,
            "desm:valueSpace": { "@id": term.property.value_space },
            "rdfs:label": term.property.label,
            "rdfs:comment": term.property.comment,
            "desm:hasTermMapping": alignment_uri(alignment),
            "desm:inSchema": { "@id": specification_uri(specification) },
            "desm:domainIncludes": domain_nodes(term),
            "desm:rangeIncludes": term.compact_ranges
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
          "desm:abstractClass": { "@id": specification.domain.source_uri },
          "dct:creator": { "@id": agent_uri }
        }
      end

      def agent_node
        {
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
        "http://desmsolutions.org/Agent/#{user.id}"
      end

      def alignment_uri(alignment)
        "http://desmsolutions.org/TermMapping/#{alignment.id}"
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

      def mapping_uri
        "http://desmsolutions.org/AbstractClassMapping/#{mapping.id}"
      end

      def specification_uri(specification)
        return unless specification

        "http://desmsolutions.org/Schema/#{specification.id}"
      end

      def term_uri(term)
        "http://desmsolutions.org/Property/#{term.id}"
      end
    end
  end
end
