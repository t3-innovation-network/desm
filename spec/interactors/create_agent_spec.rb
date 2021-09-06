# frozen_string_literal: true

require "rails_helper"

RSpec.describe CreateAgent, type: :interactor do
  describe ".call" do
    let(:test_role) { FactoryBot.build(:role) }
    let(:org) { FactoryBot.build(:organization) }

    it "rejects creation if required info isn't provided" do
      result = CreateAgent.call({github_handle: "richard0000"})
      expect(result.error).to be("Email must be present")
      expect(result.agent).to be_nil

      result = CreateAgent.call({github_handle: "richard0000", email: "test@test.com"})
      expect(result.agent).to be_nil
      expect(result.error).to be("Fullname must be present")

      result = CreateAgent.call({github_handle: "richard0000", fullname: "test"})
      expect(result.agent).to be_nil
      expect(result.error).to be("Email must be present")
    end

    it "rejects creation if email is invalid" do
      result = CreateAgent.call({github_handle: "richard0000", email: "testtest.com"})
      expect(result.agent).to be_nil
      expect(result.error).to be("Invalid email format")

      result = CreateAgent.call({github_handle: "richard0000", email: "testtest@"})
      expect(result.agent).to be_nil
      expect(result.error).to be("Invalid email format")
    end

    it "creates an agent if full info is provided" do
      result = CreateAgent.call({
                                  github_handle: "richard0000",
                                  fullname: "test",
                                  email: "test@test.com",
                                  role: test_role,
                                  organization: org
                                })

      expect(result.error).to be_nil
      expect(result.agent).to be_instance_of(User)
      expect(result.agent.organization).to be(org)
    end
  end
end
