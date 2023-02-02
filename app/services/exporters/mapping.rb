# frozen_string_literal: true

module Exporters
  ###
  # @description: Manages to export a mapping to JSON-LD format to let the user download it.
  ###
  class Mapping
    ###
    # CONSTANTS
    ###

    ###
    # @description: These are for established specs used in the mapping. This block will be the same for all mapping,
    #   the prefixes an URIs are pre-existing constants.
    ###
    CONTEXT = {
      "ceds": "http://desmsolutions.org/ns/ceds/",
      "credReg": "http://desmsolutions.org/ns/credReg/",
      "dct": "http://purl.org/dc/terms/",
      "dcterms": "http://purl.org/dc/terms/",
      "desm": "http://desmsolutions.org/ns/",
      "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
      "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
      "sdo": "http://schema.org/",
      "xsd": "http://www.w3.org/2001/XMLSchema#"
    }.freeze

    ###
    # @description: Initializes this class with the instance to export.
    ###
    def initialize instance
      @instance = instance
    end

    ###
    # @description: Exports the mapping into json-ld format.
    ###
    def export
      {
        "@context": CONTEXT,
        "@graph": [
          main_node,
          *term_nodes.compact
        ]
      }
    end

    ###
    # @description: Specifies the format the main node (the node that represents the mapping itself)
    #  should have.
    ###
    def main_node
      {
        "@id": "http://desmsolutions.org/TermMapping/#{@instance.id}",
        "@type": "desm:AbstractClassMapping",
        "dcterms:created": @instance.created_at.strftime("%F"),
        "dcterms:dateModified": @instance.updated_at.strftime("%F"),
        "dcterms:title": @instance.title,
        # @todo: Where to take this from
        "dcterms:description": "",
        "desm:abstractClassMapped": {"@id": @instance.specification.domain.uri},
        "dcterms:hasPart": @instance.alignments.map {|alignment|
          {"@id": alignment.uri}
        }
      }
    end

    ###
    # @description: For each alignment to a spine term, we build basically 3 nodes, one ofr the
    #   alignment, one for the mapped property (more than one if there are many), and the last one
    #   for the spine property.
    ###
    def term_nodes
      alignments = @instance
                   .alignments
                   .includes(:predicate, mapped_terms: :property, spine_term: :property)

      alignments.map do |alignment|
        alignment_node = build_alignment_node(alignment)
        next unless alignment_node

        [
          alignment_node,
          *alignment.mapped_terms.map {|term| build_property_node(term) },
          build_property_node(alignment.spine_term)
        ]
      end
    end

    ###
    # @description: Specifies the format the alignment node should have.
    ###
    # rubocop:disable Metrics/AbcSize
    def build_alignment_node alignment
      return if alignment.predicate.nil? || alignment.spine_term.nil?

      mapped_terms = alignment.mapped_terms.map {|mapped_term|
        {"@id": mapped_term.uri} if mapped_term.uri.nil?
      }

      node = {
        "@id": "http://desmsolutions.org/TermMapping/#{alignment.id}",
        "@type": "desm:TermMapping",
        "dcterms:isPartOf": {"@id": "http://desmsolutions.org/TermMapping/#{@instance.id}"},
        "desm:mappedterm": mapped_terms.compact,
        "desm:mappingPredicate": {"@id": alignment.predicate.uri},
        "desm:spineTerm": {"@id": alignment.spine_term.uri}
      }

      node["desm:comment"] = alignment.comment if alignment.comment?
      node
    end

    ###
    # @description: Defines the structure of a generic property term.
    ###
    def build_property_node term
      property = term.property

      node = {
        "@id": term.source_uri,
        "@type": "rdf:Property",
        "desm:sourceURI": {"@id": property.source_uri},
        "rdfs:label": term.property.label
      }

      node["rdfs:comment"] = property.comment if property.comment?
      node["rdfs:domain"] = {"@id": property.selected_domain} if property.selected_domain?
      node["rdfs:range"] = {"@id": property.selected_range} if property.selected_range?
      node["rdfs:subPropertyOf"] = {"@id": property.subproperty_of} if property.subproperty_of?
      node["desm:valueSpace"] = {"@id": property.value_space} if property.value_space?
      node
    end
    # rubocop:enable Metrics/AbcSize
  end
end
