# frozen_string_literal: true

require "rails_helper"

RSpec.describe Importers::ConfigurationProfile do
  let(:alignment_comment) { Faker::Lorem.paragraph }
  let(:alignment_synthetic) { [false, true].sample }
  let(:alignment_uri) { Faker::Internet.url }
  let(:alignment_vocabulary_title) { Faker::Lorem.word }
  let(:concept_raw) { Faker::Json.shallow_json(width: 3) }
  let(:concept_uri) { Faker::Internet.url }
  let(:description) { Faker::Lorem.sentence }
  let(:domain_definition) { Faker::Lorem.sentence }
  let(:domain_pref_label) { Faker::Lorem.word }
  let(:domain_set_description) { Faker::Lorem.sentence }
  let(:domain_set_source_uri) { Faker::Internet.url }
  let(:domain_set_title) { Faker::Lorem.word }
  let(:domain_source_uri) { Faker::Internet.url }
  let(:json_abstract_classes) { JSON(Faker::Json.shallow_json) }
  let(:json_mapping_predicates) { JSON(Faker::Json.shallow_json) }
  let(:mapping_description) { Faker::Lorem.sentence }
  let(:mapping_name) { Faker::Lorem.word }
  let(:mapping_slug) { Faker::Lorem.word }
  let(:mapping_status) { %w(uploaded in_progress mapped).sample }
  let(:mapping_title) { Faker::Lorem.word }
  let(:name) { Faker::Lorem.word }
  let(:organization_description) { Faker::Lorem.sentence }
  let(:organization_email) { Faker::Internet.email }
  let(:organization_homepage_url) { Faker::Internet.url }
  let(:organization_name) { Faker::Company.name }
  let(:organization_standards_page) { Faker::Internet.url }
  let(:predicate_color) { Faker::Color.hex_color }
  let(:predicate_definition) { Faker::Lorem.sentence }
  let(:predicate_pref_label) { Faker::Lorem.word }
  let(:predicate_set_description) { Faker::Lorem.sentence }
  let(:predicate_set_source_uri) { Faker::Internet.url }
  let(:predicate_set_title) { Faker::Lorem.word }
  let(:predicate_source_uri) { Faker::Internet.url }
  let(:predicate_weight) { 3.50 }
  let(:selected_domains_from_file) { [term_source_uri] }
  let(:specification_name) { Faker::Lorem.word }
  let(:specification_version) { "1" }
  let(:specification_use_case) { Faker::Lorem.word }
  let(:state) { %w(incomplete complete active deactivated).sample }
  let(:structure) { JSON(Faker::Json.shallow_json) }
  let(:term_identifier) { Faker::Lorem.word }
  let(:term_name) { Faker::Lorem.word }
  let(:term_raw) { JSON(Faker::Json.shallow_json) }
  let(:term_slug) { Faker::Lorem.word }
  let(:term_source_uri) { Faker::Internet.url }
  let(:user_email) { Faker::Internet.email }
  let(:user_fullname) { Faker::Name.name }
  let(:user_github_handle) { Faker::Lorem.word }
  let(:user_lead_mapper) { [false, true].sample }
  let(:user_phone) { Faker::PhoneNumber.phone_number }
  let(:user_role_name) { Faker::Lorem.word }
  let(:vocabulary_content) { Faker::Json.shallow_json(width: 3) }
  let(:vocabulary_context) { Faker::Json.shallow_json(width: 3) }
  let(:vocabulary_name) { Faker::Lorem.sentence }

  let(:data) do
    {
      "description" => description,
      "json_abstract_classes" => json_abstract_classes,
      "json_mapping_predicates" => json_mapping_predicates,
      "name" => name,
      "state" => state,
      "structure" => structure,
      "domain_set" => {
        "description" => domain_set_description,
        "source_uri" => domain_set_source_uri,
        "title" => domain_set_title,
        "domains" => [
          {
            "definition" => domain_definition,
            "pref_label" => domain_pref_label,
            "source_uri" => domain_source_uri
          }
        ]
      },
      "predicate_set" => {
        "description" => predicate_set_description,
        "source_uri" => predicate_set_source_uri,
        "title" => predicate_set_title,
        "predicates" => [
          {
            "color" => predicate_color,
            "definition" => predicate_definition,
            "pref_label" => predicate_pref_label,
            "source_uri" => predicate_source_uri,
            "weight" => 3.5
          }
        ],
        "strongest_match" => predicate_source_uri
      },
      "organizations" => [
        {
          "description" => organization_description,
          "email" => organization_email,
          "homepage_url" => organization_homepage_url,
          "name" => organization_name,
          "standards_page" => organization_standards_page
        }
      ],
      "users" => [
        {
          "email" => user_email,
          "fullname" => user_fullname,
          "github_handle" => user_github_handle,
          "lead_mapper" => user_lead_mapper,
          "mappings" => [
            {
              "description" => mapping_description,
              "name" => mapping_name,
              "slug" => mapping_slug,
              "status" => mapping_status,
              "title" => mapping_title,
              "specification" => {
                "name" => specification_name,
                "selected_domains_from_file" => selected_domains_from_file,
                "version" => specification_version,
                "use_case" => specification_use_case,
                "domain" => domain_source_uri,
                "terms" => [term_source_uri]
              },
              "selected_terms" => [term_source_uri],
              "alignments" => [
                {
                  "comment" => alignment_comment,
                  "mapped_terms" => [term_source_uri],
                  "predicate" => predicate_source_uri,
                  "spine_term" => term_source_uri,
                  "synthetic" => alignment_synthetic,
                  "uri" => alignment_uri,
                  "vocabulary" => {
                    "concepts" => [{
                      "mapped_concepts" => [concept_uri],
                      "predicate" => predicate_source_uri,
                      "spine_concept" => concept_uri
                    }],
                    "title" => alignment_vocabulary_title
                  }
                }
              ]
            }
          ],
          "organization" => organization_name,
          "phone" => user_phone,
          "roles" => [user_role_name],
          "spines" => [
            {
              "domain" => domain_source_uri,
              "terms" => [term_source_uri]
            }
          ],
          "terms" => [
            {
              "identifier" => term_identifier,
              "name" => term_name,
              "raw" => term_raw,
              "slug" => term_slug,
              "source_uri" => term_source_uri,
              "vocabularies" => [vocabulary_name]
            }
          ]
        }
      ],
      "vocabularies" => [
        {
          "concepts" => [{ "raw" => concept_raw, "uri" => concept_uri }],
          "content" => vocabulary_content,
          "context" => vocabulary_context,
          "name" => vocabulary_name
        }
      ]
    }
  end

  # rubocop:disable Layout/LineLength
  it "imports configuration profile" do
    expect do
      described_class.new(data).import
    end.to change(Alignment, :count).by(1)
             .and change(AlignmentVocabulary, :count).by(1)
                    .and change(AlignmentVocabularyConcept, :count).by(1)
                           .and change(ConfigurationProfile, :count).by(1)
                                  .and change(ConfigurationProfileUser, :count).by(1)
                                         .and change(Domain, :count).by(1)
                                                .and change(DomainSet, :count).by(1)
                                                       .and change(Mapping, :count).by(1)
                                                              .and change(Organization, :count).by(1)
                                                                     .and change(Predicate, :count).by(1)
                                                                            .and change(PredicateSet, :count).by(1)
                                                                                   .and change(Role, :count).by(1)
                                                                                          .and change(SkosConcept, :count).by(1)
                                                                                                 .and change(Specification, :count).by(1)
                                                                                                        .and change(Spine, :count).by(1)
                                                                                                               .and change(Term, :count).by(1)
                                                                                                                      .and change(User, :count).by(1)
                                                                                                                             .and change(Vocabulary, :count).by(1)
                                                                                                                                    .and change {
                                                                                                                                           ActionMailer::Base.deliveries.size
                                                                                                                                         }.by(0)

    profile = ConfigurationProfile.last
    expect(profile.configuration_profile_users.count).to eq(1)
    expect(profile.description).to eq(description)
    expect(profile.json_abstract_classes).to eq(json_abstract_classes)
    expect(profile.json_mapping_predicates).to eq(json_mapping_predicates)
    expect(profile.name).to eq(name)
    expect(profile.standards_organizations.count).to eq(1)
    expect(profile.state).to eq(state)
    expect(profile.structure).to eq(structure)
    expect(profile.users.count).to eq(1)
    expect(profile.vocabularies.count).to eq(1)

    vocabulary = profile.vocabularies.last
    expect(vocabulary.concepts.count).to eq(1)
    expect(vocabulary.content).to eq(vocabulary_content)
    expect(vocabulary.context).to eq(vocabulary_context)
    expect(vocabulary.name).to eq(vocabulary_name)

    concept = vocabulary.concepts.last
    expect(concept.raw).to eq(concept_raw)
    expect(concept.uri).to eq(concept_uri)

    domain_set = profile.abstract_classes
    expect(domain_set.description).to eq(domain_set_description)
    expect(domain_set.domains.count).to eq(1)
    expect(domain_set.source_uri).to eq(domain_set_source_uri)
    expect(domain_set.title).to eq(domain_set_title)

    domain = domain_set.domains.last
    expect(domain.definition).to eq(domain_definition)
    expect(domain.pref_label).to eq(domain_pref_label)
    expect(domain.source_uri).to eq(domain_source_uri)

    predicate_set = profile.mapping_predicates
    expect(predicate_set.description).to eq(predicate_set_description)
    expect(predicate_set.predicates.count).to eq(1)
    expect(predicate_set.source_uri).to eq(predicate_set_source_uri)
    expect(predicate_set.strongest_match.source_uri).to eq(predicate_source_uri)
    expect(predicate_set.title).to eq(predicate_set_title)

    predicate = predicate_set.predicates.last
    expect(predicate.color).to eq(predicate_color)
    expect(predicate.definition).to eq(predicate_definition)
    expect(predicate.pref_label).to eq(predicate_pref_label)
    expect(predicate.source_uri).to eq(predicate_source_uri)
    expect(predicate.weight).to eq(predicate_weight)

    organization = profile.standards_organizations.last
    expect(organization.description).to eq(organization_description)
    expect(organization.email).to eq(organization_email)
    expect(organization.homepage_url).to eq(organization_homepage_url)
    expect(organization.name).to eq(organization_name)
    expect(organization.standards_page).to eq(organization_standards_page)

    profile_user = profile.configuration_profile_users.last
    expect(profile_user.lead_mapper).to eq(user_lead_mapper)
    expect(profile_user.organization).to eq(organization)
    expect(profile_user.specifications.count).to eq(1)
    expect(profile_user.spines.count).to eq(1)
    expect(profile_user.terms.count).to eq(1)

    term = profile_user.terms.last
    expect(term.identifier).to eq(term_identifier)
    expect(term.name).to eq(term_name)
    expect(term.raw).to eq(term_raw)
    expect(term.source_uri).to eq(term_source_uri)
    expect(term.vocabularies).to eq([vocabulary])

    specification = profile_user.specifications.last
    expect(specification.name).to eq(specification_name)
    expect(specification.selected_domains_from_file).to eq(selected_domains_from_file)
    expect(specification.version).to eq(specification_version)
    expect(specification.use_case).to eq(specification_use_case)
    expect(specification.domain).to eq(domain)
    expect(specification.terms.count).to eq(1)

    spine = profile_user.spines.last
    expect(spine.domain).to eq(domain)
    expect(spine.name).to eq(domain.name)
    expect(spine.terms).to eq([term])

    user = profile_user.user
    expect(user.email).to eq(user_email)
    expect(user.fullname).to eq(user_fullname)
    expect(user.github_handle).to eq(user_github_handle)
    expect(user.mappings.count).to eq(1)
    expect(user.organization_id).to eq(organization.id)
    expect(user.phone).to eq(user_phone)
    expect(user.roles.pluck(:name)).to eq([user_role_name])

    mapping = user.mappings.last
    expect(mapping.alignments.count).to eq(1)
    expect(mapping.description).to eq(mapping_description)
    expect(mapping.name).to eq(mapping_name)
    expect(mapping.selected_terms).to eq([term])
    expect(mapping.specification).to eq(specification)
    expect(mapping.status).to eq(mapping_status)
    expect(mapping.title).to eq(mapping_title)

    alignment = mapping.alignments.last
    expect(alignment.comment).to eq(alignment_comment)
    expect(alignment.mapped_terms).to eq([term])
    expect(alignment.predicate).to eq(predicate)
    expect(alignment.spine_term).to eq(term)
    expect(alignment.synthetic).to eq(alignment_synthetic)
    expect(alignment.uri).to eq(alignment_uri)
    expect(alignment.vocabulary).to be

    alignment_vocabulary = alignment.vocabulary
    expect(alignment_vocabulary.concepts.count).to eq(1)
    expect(alignment_vocabulary.title).to eq(alignment_vocabulary_title)

    alignment_vocabulary_concept = alignment_vocabulary.concepts.last
    expect(alignment_vocabulary_concept.mapped_concepts).to eq([concept])
    expect(alignment_vocabulary_concept.predicate).to eq(predicate)
    expect(alignment_vocabulary_concept.spine_concept).to eq(concept)
  end
  # rubocop:enable Layout/LineLength
end
