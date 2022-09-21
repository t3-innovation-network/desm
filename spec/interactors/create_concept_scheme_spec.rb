# frozen_string_literal: true

require "rails_helper"

RSpec.describe CreateConceptScheme, type: :interactor do
  describe ".call" do
    let(:test_uri) { Rails.root.join("spec", "fixtures", "DisabilityLevelCodeList.json") }

    after(:all) do
      DatabaseCleaner.clean_with(:truncation)
    end

    it "rejects creation if uri is not passed" do
      result = CreateConceptScheme.call

      expect(result.error).to eq("uri must be present")
    end

    it "Creates a vocabulary with its concepts if uri is correct" do
      result = CreateConceptScheme.call({
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
