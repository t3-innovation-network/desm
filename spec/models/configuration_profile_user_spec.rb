# frozen_string_literal: true

# == Schema Information
#
# Table name: configuration_profile_users
#
#  id                       :bigint           not null, primary key
#  lead_mapper              :boolean          default(FALSE), not null
#  configuration_profile_id :bigint           not null
#  organization_id          :bigint           not null
#  user_id                  :bigint           not null
#
# Indexes
#
#  index_configuration_profile_user  (configuration_profile_id,user_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (configuration_profile_id => configuration_profiles.id) ON DELETE => cascade
#  fk_rails_...  (organization_id => organizations.id) ON DELETE => cascade
#  fk_rails_...  (user_id => users.id) ON DELETE => cascade
#
require "rails_helper"

RSpec.describe ConfigurationProfileUser, type: :model do
  describe "associations" do
    it { should belong_to(:configuration_profile) }
    it { should belong_to(:organization) }
    it { should belong_to(:user) }
    it { should have_many(:mappings) }
    it { should have_many(:specifications) }
    it { should have_many(:spines) }
    it { should have_many(:terms) }
    it { should have_many(:vocabularies).through(:configuration_profile) }
  end

  describe "callbacks" do
    describe "before_destroy" do
      let(:user) { create(:user) }
      let(:configuration_profile_user) { create(:configuration_profile_user, user:) }

      context "when mappings exist" do
        let!(:mapping) { create(:mapping, configuration_profile_user:) }

        it "raises an error" do
          expect do
            configuration_profile_user.destroy
          end.to raise_error(I18n.t("errors.config.configuration_profile_user.destroy",
                                    count: 1, message: user.fullname))
        end
      end

      context "when no mappings exist" do
        it "does not raise an error" do
          expect { configuration_profile_user.destroy }.not_to raise_error
        end
      end
    end
  end

  describe "scopes" do
    describe ".for_configuration_profile" do
      let(:configuration_profile) { create(:configuration_profile) }
      let!(:configuration_profile_user1) do
        create(:configuration_profile_user, configuration_profile:)
      end
      let!(:configuration_profile_user2) { create(:configuration_profile_user) }

      it "returns configuration profile users for the given configuration profile" do
        expect(ConfigurationProfileUser.for_configuration_profile(configuration_profile)).to \
          eq([configuration_profile_user1])
      end
    end
  end
end
