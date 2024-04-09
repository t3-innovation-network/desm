# frozen_string_literal: true

require "rails_helper"

RSpec.describe CreateDso, type: :interactor do
  describe ".call" do
    let(:admin) { build(:user) }
    let(:cp) { create(:configuration_profile) }

    it "rejects creation if not enough information is provided" do
      result = described_class.call({ administrator: admin })
      expect(result.error).to eq("configuration profile must be present")

      result = described_class.call({ administrator: admin, configuration_profile: cp })
      expect(result.error).to eq("email must be present")

      result = described_class.call({ administrator: admin, configuration_profile: cp, email: "test@email.com" })
      expect(result.error).to eq("name must be present")
    end

    it "creates a standards organization" do
      result = described_class.call({
                                      administrator: admin,
                                      configuration_profile: cp,
                                      email: "test@email.com",
                                      name: "Test Name"
                                    })

      expect(cp.standards_organizations).to eq([result.dso])
      expect(result.error).to be_nil
      expect(result.dso).to be_instance_of(Organization)
      expect(result.dso.administrator).to be(admin)
      expect(result.dso.email).to eq("test@email.com")
    end
  end
end
