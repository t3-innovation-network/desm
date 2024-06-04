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
    # @description: Initializes this class with the instance to export.
    ###
    def initialize(instance)
      @instance = instance
    end

    ###
    # @description: Exports the mapping into json-ld format.
    ###
    def export
      {
        "@context": Desm::CONTEXT,
        "@graph": @instance.alignments.map do |alignment|
          term_nodes(alignment)
        end.flatten.unshift(main_node)
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
        "desm:abstractClassMapped": { "@id": @instance.specification.domain.uri },
        "dcterms:hasPart": @instance.alignments.map do |alignment|
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
        "@id": "http://desmsolutions.org/TermMapping/#{alignment.id}",
        "@type": "desm:TermMapping",
        "dcterms:isPartOf": { "@id": "http://desmsolutions.org/TermMapping/#{@instance.id}" },
        "desm:comment": alignment.comment,
        "desm:mappedterm": alignment.mapped_terms.map do |mapped_term|
          { "@id": mapped_term.uri }
        end,
        "desm:mappingPredicate": { "@id": alignment.predicate&.uri },
        "desm:spineTerm": { "@id": alignment.spine_term.uri }
      }
    end

    ###
    # @description: Defines the structure of a generic property term.
    ###
    def property_node(term)
      {
        "@id": term.source_uri,
        "@type": "rdf:Property",
        "desm:sourceURI": { "@id": term.property.source_uri },
        "rdfs:subPropertyOf": { "@id": term.property.subproperty_of },
        "desm:valueSpace": { "@id": term.property.value_space },
        "rdfs:label": term.property.label,
        "rdfs:comment": term.property.comment,
        "rdfs:domain": { "@id": term.property.selected_domain },
        "rdfs:range": { "@id": term.property.selected_range }
      }
    end
  end
end
