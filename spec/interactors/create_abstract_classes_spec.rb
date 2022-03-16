# frozen_string_literal: true

require "rails_helper"

RSpec.describe CreateAbstractClasses, type: :interactor do
  describe ".call" do
    let(:test_json_body) { JSON.parse(File.read(Rails.root.join("concepts", "desmAbstractClasses.json"))) }

    after(:all) do
      DatabaseCleaner.clean_with(:truncation)
    end

    it "rejects creation if json body is not passed" do
      result = CreateAbstractClasses.call

      expect(result.error).to eq("json body must be present")
    end

    it "Creates a domain set with its domains if uri is correct" do
      result = CreateAbstractClasses.call({json_body: test_json_body})

      expect(result.error).to be_nil
      expect(result.domain_set).to be_instance_of(DomainSet)
      expect(result.domain_set.domains.length).to eq(8)
      expect(result.domain_set.domains.first).to be_instance_of(Domain)
    end
  end
end
