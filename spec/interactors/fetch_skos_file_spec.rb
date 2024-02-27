# frozen_string_literal: true

require "rails_helper"

RSpec.describe FetchSkosFile, type: :interactor do
  describe ".call" do
    let(:test_uri) { file_fixture("desmAbstractClasses.json") }

    it "rejects creation if uri is not passed" do
      result = described_class.call

      expect(result.error).to eq("uri must be present")
    end

    it "returns a correct skos file structure if uri is correct" do
      result = described_class.call({ uri: test_uri })

      expect(result.error).to be_nil
      expect(result.skos_file).not_to be_nil
      expect(result.skos_file[:@graph]).to be_instance_of(Array)
      expect(result.skos_file[:@graph]).not_to be_empty
      # 8 concept nodes plus 1 concept scheme node
      expect(result.skos_file[:@graph].count).to be(9)
      expect(result.concept_names).not_to be_empty
      expect(result.concept_names.count).to be(8)
      expect(result.concept_names.first[:label]).to eql("Competency")
    end
  end
end
