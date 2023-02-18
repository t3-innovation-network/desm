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
        "@type": "http://www.w3.org/2001/XMLSchema#date"
      },
      "dct:dateModified": {
        "@type": "http://www.w3.org/2001/XMLSchema#date"
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

    attr_reader :alignments, :created, :domains, :mapping, :specs, :spine_terms, :terms, :updated, :users

    delegate :configuration_profile, :organization, :specification, :spine, :title,
             to: :mapping

    delegate :domain, to: :spine

    delegate :user, to: :specification

    ###
    # @description: Initializes this class with the instance to export.
    ###
    # rubocop:disable Metrics/AbcSize, Metrics/MethodLength
    def initialize mapping
      @alignments = mapping
                    .alignments
                    .where.not(predicate_id: nil)
                    .includes(:mapped_terms, :predicate, :spine_term)

      @created = mapping.created_at.to_date
      @mapping = mapping
      @updated = mapping.updated_at.to_date
      @uris = {}
      @domains = Set.new([domain])
      @specs = Hash.new {|h, k| h[k] = [] }
      @users = Set.new([user])
      @spine_terms = spine.terms.includes(specifications: %i[domain user])

      @terms = mapping
               .terms
               .select("DISTINCT ON (terms.id) terms.*")
               .includes(specifications: %i[domain user])

      [*spine_terms, *terms].uniq.each do |term|
        spec = term.specifications.first
        domains << spec.domain
        specs[spec] << term
        users << spec.user
      end

      @term_alignments = {}

      alignments.each do |alignment|
        @term_alignments[alignment.spine_term] = alignment
        @term_alignments[alignment.mapped_terms.first] = alignment
      end
    end
    # rubocop:enable Metrics/AbcSize, Metrics/MethodLength

    ###
    # @description: Exports the mapping into json-ld format.
    ###
    def export
      {
        "@context": CONTEXT,
        "@graph": [
          config_node,
          class_node,
          domain_set_node,
          predicate_set_node,
          organization_node,
          *domain_nodes,
          *predicate_nodes,
          *user_nodes,
          *alignment_nodes,
          *term_nodes,
          *spec_nodes
        ]
      }
    end

    private

    # rubocop:disable Metrics/AbcSize
    def alignment_nodes
      @alignment_nodes ||= alignments.map do |alignment|
        mapped_term = alignment.mapped_terms.first
        spine_term = alignment.spine_term

        node = {
          "@id": build_uri(alignment),
          "@type": "desm:TermMapping",
          "dct:dateModified": alignment.updated_at.to_date,
          "dct:isPartOf": build_uri(mapping)
        }

        node["dct:description"] = alignment.comment if alignment.comment?

        node.merge(
          "desm:spineTerm": build_uri(spine_term, kind: :spine),
          "desm:mappedTerm": (build_uri(mapped_term) if mapped_term),
          "desm:mappingPredicate": alignment.predicate.source_uri
        )
      end
    end
    # rubocop:enable Metrics/AbcSize

    def build_term_node(term, spine: false)
      alignment = @term_alignments[term]
      raw = term.raw

      node = {
        "@id": build_uri(term, kind: spine ? :spine : nil),
        "@type": "rdf:Property",
        "rdfs:label": raw.fetch("rdfs:label"),
        **raw.slice("rdfs:comment"),
        "rdfs:domain": domain.source_uri
      }

      node["rdfs:subPropertyOf"] = term.source_uri unless spine
      node["desm:inTermMapping"] = build_uri(alignment) if alignment
      node.merge("desm:inSchema": build_uri(term.specifications.first))
    end

    # rubocop:disable Metrics/AbcSize, Metrics/CyclomaticComplexity
    def build_uri(resource, kind: nil)
      @uris.fetch([resource, kind]) do
        path =
          case resource
          when Alignment then "#{domain.slug}/termMapping#{resource.id}"
          when ::Mapping then "classMapping#{resource.id}"
          when Organization then resource.slug
          when Specification then "Schema/#{resource.id}-#{resource.slug}"
          when String then resource
          when Term then "#{kind == :spine ? "#{domain.slug}/spine" : 'terms'}/#{resource.id}"
          when User then "Agent#{resource.id}"
          else raise "Unsupported resource type: #{resource}"
          end

        URI(Desm::APP_DOMAIN) + "#{configuration_profile.slug}-#{configuration_profile.id}/#{path}"
      end
    end
    # rubocop:enable Metrics/AbcSize, Metrics/CyclomaticComplexity

    def class_node
      {
        "@id": build_uri(mapping),
        "@type": "desm:AbstractClassMapping",
        "dct:title": "\"#{title}\" class mapping",
        "dct:description": "A partial class mapping.",
        "dct:created": created,
        "dct:dateModified": updated,
        "desm:isClassMappingOf": build_uri("mappingConfig"),
        "desm:abstractClassModeled": domain.source_uri,
        "dct:hasPart": alignment_nodes.map {|node| node.fetch(:"@id") }
      }
    end

    # rubocop:disable Metrics/AbcSize
    def config_node
      node = {
        "@id": build_uri("mappingConfig"),
        "@type": "desm:MappingConfiguration",
        "dct:title": "Configuration for \"#{title}\" mapping"
      }

      node["dct:description"] = mapping.description if mapping.description?

      node.merge(
        "dct:created": created,
        "dct:dateModified": updated,
        "desm:hasClassMapping": build_uri(mapping),
        "desm:abstractClassType": domain_set_node.fetch(:"@id"),
        "desm:mappingPredicateType": build_uri("MappingPredicates"),
        "desm:hasDSO": build_uri(organization)
      )
    end
    # rubocop:enable Metrics/AbcSize

    def domain_nodes
      domains.map do |domain|
        node = {
          "@id": domain.source_uri,
          "@type": "skos:Concept",
          "skos:prefLabel": domain.pref_label
        }

        node["skos:definition"] = domain.definition if domain.definition?
        node.merge("skos:inScheme": domain_set_node.fetch(:"@id"))
      end
    end

    def domain_set_node
      domain_set = domain.domain_set

      node = {
        "@id": build_uri("AbstractClasses"),
        "@type": "skos:ConceptScheme",
        "dct:title": domain_set.title
      }

      node["dct:description"] = domain_set.description if domain_set.description?
      node
    end

    # rubocop:disable Metrics/AbcSize
    def organization_node
      node = {
        "@id": build_uri(organization),
        "@type": "desm:DSO",
        "dct:title": organization.name
      }

      node["dct:description"] = organization.description if organization.description?
      node["desm:homepage"] = organization.homepage_url if organization.homepage_url?
      node.merge("desm:mapper": build_uri(user))
    end
    # rubocop:enable Metrics/AbcSize

    def predicate_nodes
      mapping.predicates.distinct.map do |predicate|
        node = {
          "@id": predicate.source_uri,
          "@type": "skos:Concept",
          "skos:prefLabel": predicate.pref_label
        }

        node["skos:definition"] = predicate.definition if predicate.definition?
        node.merge("skos:inScheme": predicate_set_node.fetch(:"@id"))
      end
    end

    def predicate_set_node
      predicate_set = configuration_profile.mapping_predicates

      node = {
        "@id": build_uri("MappingPredicates"),
        "@type": "skos:ConceptScheme",
        "dct:title": predicate_set.title
      }

      node["dct:description"] = predicate_set.description if predicate_set.description?
      node
    end

    # rubocop:disable Metrics/AbcSize
    def spec_nodes
      specs.map do |spec, terms|
        node = {
          "@id": build_uri(spec),
          "@type": "desm:Schema",
          "dct:title": spec.name,
          "dct:creator": build_uri(spec.user)
        }

        node["dct:description"] = spec.use_case if spec.use_case?
        node["dct:hasVersion"] = spec.version if spec.version?
        node["desm:AbstractClass"] = spec.domain.source_uri
        node["desm:hasProperty"] = terms.map {|term| build_uri(term) }
        node
      end
    end
    # rubocop:enable Metrics/AbcSize

    def term_nodes
      @term_nodes ||= [
        *spine_terms.map {|term| build_term_node(term, spine: true) },
        *terms.map {|term| build_term_node(term) }
      ]
    end

    def user_nodes
      users.map do |user|
        node = {
          "@id": build_uri(user),
          "@type": "desm:Agent",
          "sdo:name": user.fullname,
          "sdo:email": user.email
        }

        node["sdo:telephone"] = user.phone if user.phone?
        node["sdo:githubHandle"] = user.github_handle if user.github_handle?
        node
      end
    end
  end
end
