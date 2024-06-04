# frozen_string_literal: true

module Exporters
  # Exports a configuration profile with all of its associated data
  class ConfigurationProfile
    attr_reader :instance

    delegate :abstract_classes, :mapping_predicates, :standards_organizations, :vocabularies, to: :instance

    def initialize(instance)
      @instance = instance
    end

    def export
      instance
        .slice(*%w(description json_abstract_classes json_mapping_predicates name state structure))
        .merge(
          "domain_set" => export_set(abstract_classes, entity_name: :domains),
          "organizations" => export_organizations,
          "predicate_set" => export_set(mapping_predicates, entity_name: :predicates),
          "users" => export_users,
          "vocabularies" => export_vocabularies(vocabularies)
        )
    end

    private

    def export_alignment_concepts(concepts)
      concepts.map do |concept|
        {
          "mapped_concepts" => concept.mapped_concepts.map(&:uri),
          "predicate" => concept.predicate&.source_uri,
          "spine_concept" => concept.spine_concept.uri
        }
      end
    end

    def export_alignment_vocabulary(alignment_vocabulary)
      return unless alignment_vocabulary

      {
        "concepts" => export_alignment_concepts(alignment_vocabulary.concepts),
        "title" => alignment_vocabulary.title
      }
    end

    def export_alignments(alignments)
      alignments.map do |alignment|
        alignment
          .slice(*%w(comment synthetic uri))
          .merge(
            "mapped_terms" => alignment.mapped_terms.map(&:source_uri),
            "predicate" => alignment.predicate&.source_uri,
            "spine_term" => alignment.spine_term&.source_uri,
            "vocabulary" => export_alignment_vocabulary(alignment.vocabulary)
          )
      end
    end

    def export_mappings(mappings)
      mappings.map do |mapping|
        mapping
          .slice(*%w(description name status title))
          .merge(
            "specification" => export_specification(mapping.specification),
            "selected_terms" => mapping.selected_terms.map(&:source_uri),
            "alignments" => export_alignments(mapping.alignments)
          )
      end
    end

    def export_organizations
      standards_organizations.map do |organization|
        organization.slice(*%w(description email homepage_url name standards_page))
      end
    end

    def export_set(set, entity_name:)
      entities = set.public_send(entity_name).map { |e| export_set_entity(e) }

      data = set
               .slice(*%w(description source_uri title))
               .merge(entity_name.to_s => entities)

      return data unless set.is_a?(PredicateSet)

      data.merge("strongest_match" => set.strongest_match&.source_uri)
    end

    def export_set_entity(entity)
      attrs = %w(definition pref_label source_uri)
      attrs += %w(color weight) if entity.is_a?(Predicate)
      entity.slice(*attrs)
    end

    def export_spines(spines)
      spines.map do |spine|
        {
          "domain" => spine.domain.source_uri,
          "terms" => spine.terms.map(&:source_uri)
        }
      end
    end

    def export_specification(specification)
      specification
        .slice(*%w(name selected_domains_from_file version))
        .merge(
          "domain" => specification.domain.source_uri,
          "terms" => specification.terms.map(&:source_uri)
        )
    end

    def export_terms(terms)
      terms.map do |term|
        term
          .slice(*%w(identifier name raw source_uri))
          .merge("vocabularies" => term.vocabularies.map(&:name))
      end
    end

    def export_users
      profile_users = instance
                        .configuration_profile_users
                        .includes(
                          :organization,
                          mappings: [
                            :selected_terms,
                            {
                              alignments: [
                                :mapped_terms,
                                :predicate,
                                :spine_term,
                                { vocabulary: { concepts: %i(mapped_concepts predicate spine_concept) } }
                              ]
                            },
                            { specification: %i(domain terms) }
                          ],
                          spines: %i(domain terms),
                          terms: :vocabularies,
                          user: :roles
                        )

      profile_users.map do |profile_user|
        profile_user
          .user
          .slice(*%w(email fullname github_handle phone))
          .merge(
            "lead_mapper" => profile_user.lead_mapper,
            "organization" => profile_user.organization.name,
            "mappings" => export_mappings(profile_user.mappings),
            "roles" => profile_user.user.roles.map(&:name),
            "spines" => export_spines(profile_user.spines),
            "terms" => export_terms(profile_user.terms)
          )
      end
    end

    def export_vocabularies(vocabularies)
      vocabularies.includes(:concepts).map do |vocabulary|
        vocabulary
          .slice(*%w(content context name))
          .merge("concepts" => vocabulary.concepts.map { |c| c.slice(*%w(raw uri)) })
      end
    end
  end
end
