# frozen_string_literal: true

require "rails_helper"

RSpec.describe CreateAgent, type: :interactor do
  describe ".call" do
    let(:test_role) { build(:role) }
    let(:org) { build(:organization) }

    before do
      Role.create!(name: "dso admin")
    end

    after(:all) do
      DatabaseCleaner.clean_with(:truncation)
    end

    it "rejects creation if required info isn't provided" do
      result = described_class.call({ github_handle: "richard0000" })
      expect(result.error).to be("Email must be present")
      expect(result.agent).to be_nil

      result = described_class.call({ github_handle: "richard0000", email: "test@test.com" })
      expect(result.agent).to be_nil
      expect(result.error).to be("Fullname must be present")

      result = described_class.call({ github_handle: "richard0000", fullname: "test" })
      expect(result.agent).to be_nil
      expect(result.error).to be("Email must be present")
    end

    it "rejects creation if email is invalid" do
      result = described_class.call({ github_handle: "richard0000", email: "testtest.com" })
      expect(result.agent).to be_nil
      expect(result.error).to be("Invalid email format")

      result = described_class.call({ github_handle: "richard0000", email: "testtest@" })
      expect(result.agent).to be_nil
      expect(result.error).to be("Invalid email format")
    end

    it "creates an agent if full info is provided" do
      result = described_class.call({
                                      github_handle: "richard0000",
                                      fullname: "test",
                                      email: "test@test.com",
                                      role: test_role,
                                      organization: org
                                    })

      expect(result.error).to be_nil
      expect(result.agent).to be_instance_of(User)
    end

    it "is part of the organization if the role is DSO Admin" do
      dso_admin_role = Role.find_by_name "dso admin"
      result = described_class.call({
                                      github_handle: "richard0000",
                                      fullname: "test",
                                      email: "test@test.com",
                                      role: dso_admin_role,
                                      organization: org,
                                      dso_admin: true
                                    })

      expect(result.error).to be_nil
      expect(result.agent).to be_instance_of(User)
    end
  end
end
