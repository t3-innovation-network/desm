# frozen_string_literal: true

# == Schema Information
#
# Table name: domains
#
#  id            :bigint           not null, primary key
#  definition    :text
#  pref_label    :string           not null
#  slug          :string
#  source_uri    :string           not null
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  domain_set_id :bigint           not null
#
# Indexes
#
#  index_domains_on_domain_set_id                 (domain_set_id)
#  index_domains_on_domain_set_id_and_source_uri  (domain_set_id,source_uri) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (domain_set_id => domain_sets.id) ON DELETE => cascade
#
require "rails_helper"

describe Domain do
  subject { create(:domain) }

  before(:all) do
    name_raw = {
      id: "name",
      type: "rdf:Property",
      label: { en: "Human-readable version of the name of a resource." },
      domain: [
        "rdf:Property",
        "rdfs:Class"
      ],
      range: "rdf:langString",
      isDefinedBy: "rdfs:"
    }

    description_raw = {
      id: "description",
      type: "rdf:Property",
      label: { en: "Extended description of a resource." },
      domain: [
        "rdf:Property",
        "rdfs:Class"
      ],
      range: "rdf:langString",
      isDefinedBy: "rdfs:"
    }

    create(:term, name: "name", raw: name_raw,
                  source_uri: "http://desm.testing/api/v1/resources/terms/name")
    create(:term, name: "description", raw: description_raw,
                  source_uri: "http://desm.testing/api/v1/resources/terms/description")
  end

  it "validates presence" do
    is_expected.to validate_presence_of(:source_uri)
    is_expected.to validate_presence_of(:pref_label)
  end

  it "generates a spine when the first specification gets linked" do
    spec = create(:specification, domain: subject)
    spec.update!(domain: subject)

    expect(subject.spine).not_to be_nil
    expect(subject.spine.name).to eql(subject.name)
  end
end
