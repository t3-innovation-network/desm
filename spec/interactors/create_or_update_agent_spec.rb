# frozen_string_literal: true

require "rails_helper"

RSpec.describe CreateOrUpdateAgent, type: :interactor do
  describe ".call" do
    context "with invalid params" do
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
    end

    context "with valid params" do
      let(:test_role) { build(:role) }
      let(:org) { build(:organization) }
      let(:user) { build(:user, github_handle: Faker::Lorem.word) }
      let(:user_params) { user.attributes.slice(*%w(fullname email phone github_handle)).symbolize_keys }
      subject { described_class.call(user_params.merge(role: test_role)) }

      context "with non existing agent" do
        it "creates an agent if full info is provided" do
          expect { subject }.to change { User.count }.by(1)
                                  .and change { Assignment.count }.by(1)
          expect(subject.success?).to be_truthy
          expect(subject.agent).to be_instance_of(User)
          expect(subject.agent.password).to eq(Desm::DEFAULT_PASS)
          expect(subject.agent.roles).to include(test_role)
        end
      end

      context "with existing agent" do
        let!(:agent) { create(:user, email: user.email) }

        it "updates an existing agent" do
          expect { subject }.to change { User.count }.by(0)
                                  .and change { Assignment.count }.by(1)
          expect(subject.success?).to be_truthy
          expect(subject.agent).to be_instance_of(User)
          expect(subject.agent.id).to eq agent.id
          expect(subject.agent.password).not_to eq(Desm::DEFAULT_PASS)
          expect(subject.agent.github_handle).to eq user.github_handle
          expect(subject.agent.roles).to include(test_role)
        end
      end
    end
  end
end
