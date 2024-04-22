# frozen_string_literal: true

require "rails_helper"

RSpec.describe CreateOrUpdateDso, type: :interactor do
  describe ".call" do
    let(:cp) { create(:configuration_profile) }

    context "with invalid parameters" do
      let(:admin) { build(:user) }

      it "rejects creation if not enough information is provided" do
        result = described_class.call({ administrator: admin })
        expect(result.error).to eq("configuration profile must be present")

        result = described_class.call({ administrator: admin, configuration_profile: cp })
        expect(result.error).to eq("email must be present")

        result = described_class.call({ administrator: admin, configuration_profile: cp, email: "test@email.com" })
        expect(result.error).to eq("name must be present")
      end
    end

    context "with valid parameters" do
      let!(:mapper_role) { create(:role, name: Desm::MAPPER_ROLE_NAME) }
      let(:dso) { build(:organization) }
      let(:user1) { build(:user) }
      let!(:user2) { create(:user) }
      let(:dso_agents) do
        [user1.attributes.slice(*%w(fullname email phone github_handle)).symbolize_keys,
         user2.attributes.slice(*%w(fullname email phone github_handle)).symbolize_keys]
      end
      subject { described_class.call({ configuration_profile: cp, email: dso.email, name: dso.name, dso_agents: }) }

      context "with non existing organization" do
        it "creates a standards organization" do
          expect { subject }.to change { Organization.count }.by(1).and change {
                                                                          ConfigurationProfileUser.count
                                                                        }.by(2).and change {
                                                                                      User.count
                                                                                    }.by(1)
          expect(subject.success?).to be_truthy
          expect(subject.dso).to be_instance_of(Organization)
          expect(subject.dso.email).to eq(dso.email)
          expect(subject.dso.name).to eq(dso.name)
          expect(subject.dso.configuration_profile_users.count).to eq(2)
          expect(subject.dso.configuration_profiles).to eq([cp])
        end
      end

      context "with existing organization" do
        let(:user3) { create(:user) }
        let!(:dso1) { create(:organization, name: dso.name) }
        let!(:cp_user1) do
          create(:configuration_profile_user, configuration_profile: cp, user: user3, organization: dso1)
        end
        let!(:cp_user2) do
          create(:configuration_profile_user, configuration_profile: cp, user: user2, organization: dso1)
        end
        let!(:cp_user3) { create(:configuration_profile_user, user: user2, organization: dso1) }

        context "with existing agents that can be removed" do
          it "updates organization, creates agents and removes deleted agents" do
            expect { subject }.to change { Organization.count }.by(0).and change {
                                                                            ConfigurationProfileUser.count
                                                                          }.by(0).and change {
                                                                                        User.count
                                                                                      }.by(1)
            expect(subject.success?).to be_truthy
            expect(subject.dso).to eq(dso1)
            expect(subject.dso.email).to eq(dso.email)
            expect(subject.dso.name).to eq(dso.name)
            expect(subject.dso.configuration_profile_users.count).to eq(3)
            expect(subject.dso.configuration_profile_users.for_configuration_profile(cp).count).to eq(2)
            expect(subject.dso.configuration_profiles).to include cp
            # check that cp_user1 was destroyed
            expect { cp_user1.reload }.to raise_error(ActiveRecord::RecordNotFound)
            expect(cp_user2.reload.organization).to eq(dso1)
          end
        end

        context "with existing agents that can't be removed" do
          let!(:mapping) { create(:mapping, configuration_profile_user: cp_user1) }

          it "returns failure and do nothing" do
            expect { subject }.to change { Organization.count }.by(0).and change {
                                                                            ConfigurationProfileUser.count
                                                                          }.by(0).and change {
                                                                                        User.count
                                                                                      }.by(0)
            expect(subject.success?).to be_falsey
            expect(subject.dso).to eq dso1
            expect(dso1.reload.email).not_to eq(dso.email)
            expect(subject.dso.configuration_profile_users.count).to eq 3
            expect(subject.dso.configuration_profile_users.for_configuration_profile(cp).count).to eq 2
          end
        end
      end
    end
  end
end
