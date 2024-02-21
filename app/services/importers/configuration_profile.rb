# frozen_string_literal: true

module Importers
  class ConfigurationProfile
    attr_reader :data

    def initialize(data, name: nil)
      @data = data
      @data["name"] = name if name.present?
    end

    # rubocop:disable Metrics/AbcSize, Metrics/CyclomaticComplexity, Metrics/MethodLength, Metrics/PerceivedComplexity
    def import
      # rubocop:disable Metrics/BlockLength
      ApplicationRecord.transaction do
        profile = ::ConfigurationProfile.create!(
          data.slice(*%w(description json_abstract_classes json_mapping_predicates name structure))
        )

        domain_set = DomainSet.create!(
          configuration_profile: profile,
          **data.fetch("domain_set").slice(*%w(description source_uri title))
        )

        data.dig("domain_set", "domains").each do |domain_data|
          domain_set.domains.create!(
            domain_data.slice(*%w(definition pref_label source_uri))
          )
        end

        predicate_set = PredicateSet.create!(
          configuration_profile: profile,
          **data.fetch("predicate_set").slice(*%w(description source_uri title))
        )

        data.dig("predicate_set", "predicates").each do |predicate_data|
          predicate_set.predicates.create!(
            predicate_data.slice(*%w(color definition pref_label source_uri weight))
          )
        end

        predicate_set.update!(
          strongest_match: predicate_set
            .predicates
            .find_by(source_uri: data.dig("predicate_set", "strongest_match"))
        )

        data.fetch("organizations").each do |organization_data|
          profile.standards_organizations << Organization
                                               .create_with(organization_data.slice(*%w(description email homepage_url
                                                                                        standards_page)))
                                               .find_or_create_by!(name: organization_data.fetch("name"))
        end

        data.fetch("vocabularies").each do |vocabulary_data|
          vocabulary = profile.vocabularies.create!(
            vocabulary_data.slice(*%w(content context name))
          )

          vocabulary_data.fetch("concepts").each do |concept_data|
            concept = SkosConcept
                        .create_with(raw: concept_data["raw"])
                        .find_or_create_by(uri: concept_data["uri"])

            vocabulary.concepts << concept
          end
        end

        data.fetch("users").each do |user_data|
          organization_id = profile.standards_organizations.find_by!(name: user_data.fetch("organization")).id
          user = User
                   .create_with(
                     **user_data.slice(*%w(fullname github_handle phone)),
                     organization_id:,
                     password: ENV.fetch("DEFAULT_PASS"),
                     skip_sending_welcome_email: true
                   )
                   .find_or_create_by!(email: user_data.fetch("email"))

          user_data.fetch("roles").each do |role_name|
            user.roles << Role.find_or_create_by!(name: role_name)
          end

          profile_user = profile.configuration_profile_users.create!(
            lead_mapper: user_data.fetch("lead_mapper"),
            organization: Organization.find_by(name: user_data.fetch("organization")),
            user:
          )

          user_data.fetch("terms").each do |term_data|
            profile_user.terms.create!(
              **term_data.slice(*%w(identifier name raw source_uri)),
              vocabularies: profile.vocabularies.where(name: term_data.fetch("vocabularies"))
            )
          end
        end

        # rubocop:disable Style/CombinableLoops
        data.fetch("users").each do |user_data|
          profile_user = profile
                           .configuration_profile_users
                           .joins(:user)
                           .where(users: { email: user_data.fetch("email") })
                           .last

          user_data["mappings"].each do |mapping_data|
            specification_data = mapping_data.fetch("specification")
            domain = domain_set.domains.find_by(source_uri: specification_data.fetch("domain"))

            specification = profile_user.specifications.create!(
              **specification_data.slice(*%w(name selected_domains_from_file version use_case)),
              domain:,
              terms: profile.terms.where(source_uri: specification_data.fetch("terms"))
            )

            spine = domain.spine

            mapping = profile_user.mappings.create!(
              **mapping_data.slice(*%w(description name status title)),
              selected_terms: profile.terms.where(source_uri: mapping_data.fetch("selected_terms")),
              specification:,
              spine:
            )

            mapping_data.fetch("alignments").each do |alignment_data|
              if alignment_data.fetch("predicate")
                predicate = predicate_set
                              .predicates
                              .find_by!(source_uri: alignment_data.fetch("predicate"))
              end

              if alignment_data.fetch("spine_term")
                spine_term = profile
                               .terms
                               .find_by!(source_uri: alignment_data.fetch("spine_term"))
              end

              spine.terms << spine_term if spine_term && !spine.terms.exists?(id: spine_term.id)

              alignment = mapping.alignments.create!(
                **alignment_data.slice(*%w(comment synthetic uri)),
                mapped_terms: profile.terms.where(source_uri: alignment_data.fetch("mapped_terms")),
                predicate:,
                spine_term:
              )

              vocabulary_data = alignment_data.fetch("vocabulary")
              next unless vocabulary_data

              vocabulary = alignment.create_vocabulary!(title: vocabulary_data.fetch("title"))

              vocabulary_data.fetch("concepts").each do |concept_data|
                concept = vocabulary.concepts.find_or_initialize_by(
                  spine_concept: profile.concepts.find_by!(uri: concept_data.fetch("spine_concept"))
                )

                concept.mapped_concepts |= profile.concepts.where(uri: concept_data.fetch("mapped_concepts"))
                concept.predicate = predicate_set.predicates.find_by(source_uri: concept_data.fetch("predicate"))
                concept.save!
              end
            end
          end
        end
        # rubocop:enable Style/CombinableLoops

        profile.update_column(:state, data.fetch("state"))
      end
      # rubocop:enable Metrics/BlockLength
    end
    # rubocop:enable Metrics/AbcSize, Metrics/CyclomaticComplexity, Metrics/MethodLength, Metrics/PerceivedComplexity
  end
end
