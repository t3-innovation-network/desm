# frozen_string_literal: true

require "rails_helper"

RSpec.describe CreateMappingPredicates, type: :interactor do
  describe ".call" do
    let(:test_json_body) { json_fixture("desmMappingPredicates.json") }

    it "rejects creation if json body is not passed" do
      result = described_class.call

      expect(result.error).to eq("json body must be present")
    end

    it "Creates a predicate set with its predicates if uri is correct" do
      result = described_class.call({ json_body: test_json_body })

      expect(result.error).to be_nil
      expect(result.predicate_set).to be_instance_of(PredicateSet)
      expect(result.predicate_set.predicates.length).to eq(9)
      expect(result.predicate_set.predicates.first).to be_instance_of(Predicate)
    end

    it "Assigns the strongest match if it's specified" do
      result = described_class.call({ json_body: test_json_body,
                                      strongest_match: "http://desmsolutions.org/concepts/identical" })

      expect(result.success?).to be_truthy
      expect(result.predicate_set.strongest_match).not_to be_nil
      expect(result.predicate_set.strongest_match.name).to eql("Identical")
    end

    it "Assigns the strongest match even if not specified" do
      result = described_class.call({ json_body: test_json_body })

      expect(result.predicate_set.strongest_match).not_to be_nil
    end
  end
end
