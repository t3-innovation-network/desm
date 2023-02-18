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
      "xsd": "http://www.w3.org/2001/XMLSchema#",
      "dct:title": {
        "@container": "@language"
      },
      "dct:description": {
        "@container": "@language"
      },
      "dct:created": {
        "@type": "http://www.w3.org/2001/XMLSchema#dateTime"
      },
      "dct:dateModified": {
        "@type": "http://www.w3.org/2001/XMLSchema#dateTime"
      },
      "desm:abstractClassType": {
        "@type": "@id"
      },
      "desm:hasClassMapping": {
        "@type": "@id"
      },
      "desm:hasDSO": {
        "@type": "@id"
      },
      "desm:abstractClassModeled": {
        "@type": "@id"
      },
      "dct:hasPart": {
        "@type": "@id"
      },
      "desm:spineTerm": {
        "@type": "@id"
      },
      "desm:mappedTerm": {
        "@type": "@id"
      },
      "desm:mappingPredicate": {
        "@type": "@id"
      },
      "rdfs:label": {
        "@container": "@language"
      },
      "rdfs:comment": {
        "@container": "@language"
      },
      "rdfs:domain": {
        "@type": "@id"
      },
      "rdfs:subPropertyOf": {
        "@type": "@id"
      },
      "desm:inSchema": {
        "@type": "@id"
      }
    }.freeze

    attr_reader :alignments, :mapping

    delegate :created_at, :slug, :spine, :title, :updated_at,
             to: :mapping
    delegate :domain, to: :spine

    ###
    # @description: Initializes this class with the instance to export.
    ###
    def initialize mapping
      @alignments = mapping
                    .alignments
                    .where.not(predicate_id: nil)
                    .includes(:mapped_terms, :predicate, :spine_term)

      @mapping = mapping
    end

    ###
    # @description: Exports the mapping into json-ld format.
    ###
    def export
      {
        "@context": CONTEXT,
        "@graph": [config_node, class_node, *alignment_nodes]
      }
    end

    private

    def alignment_nodes
      @alignment_nodes ||= alignments.map {|alignment|
        build_alignment_node(alignment)
      }
    end

    # rubocop:disable Metrics/AbcSize
    def build_alignment_node(alignment)
      mapped_term = alignment.mapped_terms.first
      spine_term = alignment.spine_term

      node = {
        "@id": build_uri("termMapping#{alignment.id}"),
        "@type": "desm:TermMapping",
        "dct:dateModified": alignment.updated_at.to_date,
        "dct:created": alignment.created_at.to_date
      }

      if alignment.comment?
        node["dct:description"] = {
          "en": alignment.comment
        }
      end

      node.merge(
        "desm:spineTerm": build_uri("terms/#{spine_term.id}"),
        "desm:mappedTerm": (build_uri("terms/#{mapped_term.id}") if mapped_term),
        "desm:mappingPredicate": build_uri("predicates/#{alignment.predicate.slug}")
      )
    end
    # rubocop:enable Metrics/AbcSize

    def build_uri(value)
      URI(Desm::APP_DOMAIN) + "#{slug}-#{mapping.id}/#{value}"
    end

    def class_node
      {
        "@id": build_uri("classMapping"),
        "@type": "desm:AbstractClassMapping",
        "dct:title": {
          "en": "`#{title}` class mapping"
        },
        "dct:description": {
          "en": "A partial class mapping."
        },
        "dct:created": created_at.to_date,
        "dct:dateModified": updated_at.to_date,
        "desm:isClassMappingOf": build_uri("mappingConfig"),
        "desm:abstractClassModeled": build_uri("AbstractClasses/#{domain.slug}"),
        "dct:hasPart": alignment_nodes.map {|node| node.fetch(:"@id") }
      }
    end

    def config_node
      {
        "@id": build_uri("mappingConfig"),
        "@type": "desm:MappingConfiguration",
        "dct:title": {
          "en": "Configuration for `#{title}` mapping"
        },
        "dct:description": {
          "en": "A partial mapping config."
        },
        "dct:created": created_at.to_date,
        "dct:dateModified": updated_at.to_date,
        "desm:hasClassMapping": "http://desmsolutions.org/#{slug}/classMapping",
        "desm:abstractClassType": build_uri("AbstractClasses"),
        "desm:mappingPredicateType": build_uri("MappingPredicates"),
        "desm:hasDSO": build_uri("mappingConfig")
      }
    end
  end
end
