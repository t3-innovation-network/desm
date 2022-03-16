# frozen_string_literal: true

require "rails_helper"

RSpec.describe CreateDso, type: :interactor do
  describe ".call" do
    let(:admin) { FactoryBot.build(:user) }
    let(:cp) { FactoryBot.build(:configuration_profile) }

    after(:all) do
      DatabaseCleaner.clean_with(:truncation)
    end

    it "rejects creation if not enough information is provided" do
      result = CreateDso.call
      expect(result.error).to eq("administrator must be present")

      result = CreateDso.call({administrator: admin})
      expect(result.error).to eq("configuration profile must be present")

      result = CreateDso.call({administrator: admin, configuration_profile: cp})
      expect(result.error).to eq("email must be present")

      result = CreateDso.call({administrator: admin, configuration_profile: cp, email: "test@email.com"})
      expect(result.error).to eq("name must be present")
    end

    it "creates a standards organization" do
      result = CreateDso.call({
                                administrator: admin,
                                configuration_profile: cp,
                                email: "test@email.com",
                                name: "Test Name"
                              })

      expect(result.error).to be_nil
      expect(result.dso).to be_instance_of(Organization)
      expect(result.dso.configuration_profile).to be(cp)
      expect(result.dso.administrator).to be(admin)
      expect(result.dso.email).to eq("test@email.com")
    end
  end
end
