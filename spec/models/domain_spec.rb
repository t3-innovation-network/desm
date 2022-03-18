# frozen_string_literal: true

require "rails_helper"

describe Domain, type: :model do
  subject { FactoryBot.create(:domain) }
  it "has a valid factory" do
    expect(FactoryBot.build(:domain_set)).to be_valid
  end

  before(:all) do
    name_raw = {
      "id": "name",
      "type": "rdf:Property",
      "label": {"en": "Human-readable version of the name of a resource."},
      "domain": [
        "rdf:Property",
        "rdfs:Class"
      ],
      "range": "rdf:langString",
      "isDefinedBy": "rdfs:"
    }

    description_raw = {
      "id": "description",
      "type": "rdf:Property",
      "label": {"en": "Extended description of a resource."},
      "domain": [
        "rdf:Property",
        "rdfs:Class"
      ],
      "range": "rdf:langString",
      "isDefinedBy": "rdfs:"
    }

    FactoryBot.create(:term, name: "name", raw: name_raw,
                             source_uri: "http://desm.testing/api/v1/resources/terms/name")
    FactoryBot.create(:term, name: "description", raw: description_raw,
                             source_uri: "http://desm.testing/api/v1/resources/terms/description")
  end

  it { should validate_presence_of(:source_uri) }
  it { should validate_presence_of(:pref_label) }

  it "generates a spine when the first specification gets linked" do
    spec = FactoryBot.create(:specification, domain: subject)
    spec.update!(domain: subject)

    expect(subject.spine.nil?).to be_falsey
    expect(subject.spine.name).to eql(subject.name)
  end
end
