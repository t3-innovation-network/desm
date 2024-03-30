# frozen_string_literal: true

require "rails_helper"

RSpec.describe UpdateDsos, type: :interactor do
  let(:structure) { { "standards_organizations" => [dso_data] } }
  let(:dso_data) { { name: "Test DSO", email: "test@example.com" } }
  let(:configuration_profile) { create(:configuration_profile, structure:) }

  describe ".call" do
    subject { described_class.call(configuration_profile:) }

    context "when creating a new DSO" do
      it "calls CreateOrUpdateDso interactor, cleans up not existings DSOs" do
        expect(CreateOrUpdateDso).to receive(:call).with(dso_data.stringify_keys.merge(configuration_profile:))
                                       .and_call_original
        expect { subject }.to change { Organization.count }.by(1)
        expect(subject.success?).to be_truthy
      end
    end

    context "when an error occurs" do
      before do
        allow(CreateOrUpdateDso).to receive(:call).and_return(double(success?: false, error: "Something went wrong"))
      end

      it "fails the context with an error message" do
        expect(subject.failure?).to be_truthy
        expect(subject.error).to eq("Something went wrong")
      end
    end

    context "when cleaning up not existing DSOs" do
      let!(:dso1) { create(:organization, name: "Test DSO") }
      let!(:dso2) { create(:organization, configuration_profiles: [configuration_profile]) }

      before { configuration_profile.reload }

      context "when DSO has configuration profile users" do
        let!(:cp_user) { create(:configuration_profile_user, organization: dso2, configuration_profile:) }

        it "returns an error" do
          expect { subject }.not_to change { Organization.count }
          expect(subject.success?).to be_falsey
          expect(subject.error).to eq I18n.t("errors.config.organization.destroy",
                                             count: 1, message: dso2.name)
          expect(dso2.reload).to eq dso2
        end
      end

      context "when DSO has no configuration profile users" do
        it "deletes the organization <-> configuration profile association" do
          expect { subject }.not_to change { Organization.count }
          expect(subject.success?).to be_truthy
          expect(dso2.reload).to eq dso2
          expect(configuration_profile.reload.standards_organizations).to eq([dso1])
        end
      end
    end
  end
end
