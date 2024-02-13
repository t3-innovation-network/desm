# frozen_string_literal: true

require "rails_helper"

RSpec.describe CreateSchema, type: :interactor do
  describe ".call" do
    let(:spec) { Rails.root.join("spec", "fixtures", "credreg.json") }
    let(:org) { FactoryBot.create(:organization) }
    let(:user) { FactoryBot.create(:configuration_profile_user) }
    let(:domain) { FactoryBot.create(:domain) }

    after(:all) do
      DatabaseCleaner.clean_with(:truncation)
    end

    it "rejects creation if not enough information is provided" do
      result = CreateSchema.call
      expect(result.error).to eq("domain_id must be present")

      result = CreateSchema.call({ domain_id: domain.id })
      expect(result.error).to eq("name must be present")

      result = CreateSchema.call({ domain_id: domain.id, name: "test" })
      expect(result.error).to eq("configuration profile user must be present")

      result = CreateSchema.call({ domain_id: domain.id, name: "test", configuration_profile_user: user })
      expect(result.error).to eq("uri must be present")
    end

    it "creates a specification with its terms if valid data is provided" do
      result = CreateSchema.call({
                                   name: "test",
                                   uri: spec,
                                   configuration_profile_user: user,
                                   domain_id: domain.id
                                 })

      expect(result.error).to be_nil
      expect(result.specification).to be_instance_of(Specification)
      expect(result.specification.terms.length).to eq(295)
      expect(result.specification.terms.first).to be_instance_of(Term)
    end
  end
end
