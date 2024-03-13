# frozen_string_literal: true

require "rails_helper"

RSpec.describe CreateConceptScheme, type: :interactor do
  describe ".call" do
    let(:test_uri) { file_fixture("DisabilityLevelCodeList.json") }

    it "rejects creation if uri is not passed" do
      result = described_class.call

      expect(result.error).to eq("uri must be present")
    end

    it "Creates a vocabulary with its concepts if uri is correct" do
      result = described_class.call({
                                      uri: test_uri,
                                      name: "test",
                                      configuration_profile: create(:configuration_profile)
                                    })

      expect(result.error).to be_nil
      expect(result.vocabulary).to be_instance_of(Vocabulary)
      expect(result.vocabulary.concepts.length).to eq(5)
      expect(result.vocabulary.concepts.first).to be_instance_of(SkosConcept)
    end
  end
end
