# frozen_string_literal: true

require "rails_helper"

RSpec.describe Exporters::ConfigurationProfile do
  let(:alignment) { mapping.alignments.last }
  let(:concept) { create(:skos_concept) }
  let(:data) { described_class.new(profile).export }
  let(:domain) { create(:domain) }
  let(:domain_set) { domain.domain_set }
  let(:organization) { create(:organization) }
  let(:predicate) { create(:predicate) }
  let(:predicate_set) { predicate.predicate_set }
  let(:role) { create(:role, name: Desm::MAPPER_ROLE_NAME) }
  let(:specification) { create(:specification, selected_domains_from_file: [term.source_uri]) }
  let(:spine) { create(:spine, configuration_profile_user: profile_user, domain:, terms: [term]) }
  let(:term) { create(:term, configuration_profile_user: profile_user, vocabularies: [vocabulary]) }
  let(:user) { create(:user, roles: [role]) }
  let(:vocabulary) { create(:vocabulary, concepts: [concept]) }

  let(:alignment_data) do
    mapping.alignments.map do |alignment|
      {
        "comment" => alignment.comment,
        "mapped_terms" => [term.source_uri],
        "predicate" => predicate.source_uri,
        "spine_term" => term.source_uri,
        "synthetic" => alignment.synthetic,
        "uri" => alignment.uri,
        "vocabulary" => alignment_vocabulary_data
      }
    end
  end

  let(:alignment_concept_data) do
    [
      {
        "mapped_concepts" => [concept.uri],
        "predicate" => predicate.source_uri,
        "spine_concept" => concept.uri
      }
    ]
  end

  let(:alignment_vocabulary_data) do
    {
      "concepts" => alignment_concept_data,
      "title" => alignment.vocabulary.title
    }
  end

  let(:domain_set_data) do
    {
      "description" => domain_set.description,
      "source_uri" => domain_set.source_uri,
      "title" => domain_set.title,
      "domains" => [
        {
          "definition" => domain.definition,
          "pref_label" => domain.pref_label,
          "source_uri" => domain.source_uri
        }
      ]
    }
  end

  let(:organization_data) do
    [
      {
        "description" => organization.description,
        "email" => organization.email,
        "homepage_url" => organization.homepage_url,
        "name" => organization.name,
        "standards_page" => organization.standards_page
      }
    ]
  end

  let(:predicate_set_data) do
    {
      "description" => predicate_set.description,
      "source_uri" => predicate_set.source_uri,
      "title" => predicate_set.title,
      "predicates" => [
        {
          "color" => predicate.color,
          "definition" => predicate.definition,
          "pref_label" => predicate.pref_label,
          "source_uri" => predicate.source_uri,
          "weight" => predicate.weight
        }
      ],
      "strongest_match" => predicate.source_uri
    }
  end

  let(:profile) do
    create(
      :configuration_profile,
      abstract_classes: domain_set,
      mapping_predicates: predicate_set,
      standards_organizations: [organization],
      vocabularies: [vocabulary]
    )
  end

  let(:specification_data) do
    {
      "name" => specification.name,
      "selected_domains_from_file" => [term.source_uri],
      "version" => specification.version,
      "use_case" => specification.use_case,
      "domain" => specification.domain.source_uri,
      "terms" => specification.terms.map(&:source_uri)
    }
  end

  let(:spine_data) do
    [
      {
        "domain" => domain.source_uri,
        "terms" => [term.source_uri]
      }
    ]
  end

  let(:user_data) do
    [
      {
        "email" => user.email,
        "fullname" => user.fullname,
        "github_handle" => user.github_handle,
        "lead_mapper" => profile_user.lead_mapper?,
        "mappings" => user_mapping_data,
        "organization" => organization.name,
        "phone" => user.phone,
        "roles" => [role.name],
        "spines" => spine_data,
        "terms" => user_term_data
      }
    ]
  end

  let(:user_mapping_data) do
    [
      {
        "description" => mapping.description,
        "name" => mapping.name,
        "status" => mapping.status,
        "title" => mapping.title,
        "specification" => specification_data,
        "selected_terms" => [term.source_uri],
        "alignments" => alignment_data
      }
    ]
  end

  let(:user_term_data) do
    [
      {
        "identifier" => term.identifier,
        "name" => term.name,
        "raw" => term.raw,
        "source_uri" => term.source_uri,
        "vocabularies" => [vocabulary.name]
      }
    ]
  end

  let(:vocabulary_data) do
    [
      {
        "concepts" => [{ "raw" => concept.raw, "uri" => concept.uri }],
        "content" => vocabulary.content,
        "context" => vocabulary.context,
        "name" => vocabulary.name
      }
    ]
  end

  let!(:mapping) do
    create(
      :mapping,
      configuration_profile_user: profile_user,
      selected_terms: [term],
      spine:,
      specification:
    )
  end

  let!(:profile_user) do
    create(
      :configuration_profile_user,
      configuration_profile: profile,
      lead_mapper: [false, true].sample,
      organization:,
      user:
    )
  end

  before do
    predicate_set.update!(strongest_match: predicate)

    alignment.update!(
      mapped_terms: [term],
      predicate:,
      synthetic: [false, true].sample
    )

    create(
      :alignment_vocabulary,
      alignment:,
      concepts: [
        build(
          :alignment_vocabulary_concept,
          mapped_concepts: [concept],
          predicate:,
          spine_concept: concept
        )
      ]
    )
  end

  it "exports everything" do
    expect(data["description"]).to eq(profile.description)
    expect(data["domain_set"]).to eq(domain_set_data)
    expect(data["json_abstract_classes"]).to eq(profile.json_abstract_classes)
    expect(data["json_mapping_predicates"]).to eq(profile.json_mapping_predicates)
    expect(data["name"]).to eq(profile.name)
    expect(data["organizations"]).to eq(organization_data)
    expect(data["predicate_set"]).to eq(predicate_set_data)
    expect(data["state"]).to eq(profile.state)
    expect(data["structure"]).to eq(profile.structure)
    expect(data["users"]).to eq(user_data)
    expect(data["vocabularies"]).to eq(vocabulary_data)
  end
end
