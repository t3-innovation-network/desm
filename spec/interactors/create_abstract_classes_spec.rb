# frozen_string_literal: true

require "rails_helper"

RSpec.describe CreateAbstractClasses, type: :interactor do
  describe ".call" do
    let(:test_uri) { Rails.root.join("concepts", "desmAbstractClasses.json") }

    it "rejects creation if uri is not passed" do
      result = CreateAbstractClasses.call

      expect(result.error).to eq("uri must be present")
    end

    it "Creates a domain set with its domains if uri is correct" do
      result = CreateAbstractClasses.call({uri: test_uri})

      expect(result.error).to be_nil
      expect(result.domain_set).to be_instance_of(DomainSet)
      expect(result.domain_set.domains.length).to eq(8)
      expect(result.domain_set.domains.first).to be_instance_of(Domain)
    end
  end
end
