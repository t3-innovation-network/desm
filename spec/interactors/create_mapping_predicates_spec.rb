# frozen_string_literal: true

require "rails_helper"

RSpec.describe CreateMappingPredicates, type: :interactor do
  describe ".call" do
    let(:test_json_body) { JSON.parse(File.read(Rails.root.join("concepts", "desmMappingPredicates.json"))) }

    after(:all) do
      DatabaseCleaner.clean_with(:truncation)
    end

    it "rejects creation if json body is not passed" do
      result = CreateMappingPredicates.call

      expect(result.error).to eq("json body must be present")
    end

    it "Creates a predicate set with its predicates if uri is correct" do
      result = CreateMappingPredicates.call({ json_body: test_json_body })

      expect(result.error).to be_nil
      expect(result.predicate_set).to be_instance_of(PredicateSet)
      expect(result.predicate_set.predicates.length).to eq(9)
      expect(result.predicate_set.predicates.first).to be_instance_of(Predicate)
    end

    it "Assigns the strongest match if it's specified" do
      result = CreateMappingPredicates.call({ json_body: test_json_body, strongest_match: "Identical" })

      expect(result.predicate_set.strongest_match.nil?).to be_falsey
      expect(result.predicate_set.strongest_match.name).to be_eql("Identical")
    end

    it "Assigns the strongest match even if not specified" do
      result = CreateMappingPredicates.call({ json_body: test_json_body })

      expect(result.predicate_set.strongest_match.nil?).to be_falsey
    end
  end
end
