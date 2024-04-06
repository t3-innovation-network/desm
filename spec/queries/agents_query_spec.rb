# frozen_string_literal: true

require "rails_helper"

RSpec.describe AgentsQuery do
  let(:scope) { User.all }
  let(:params) { {} }

  subject { described_class.call(scope, params:) }

  describe "#call" do
    context "without data" do
      it "returns a empty relation" do
        expect(subject).to be_a(ActiveRecord::Relation)
      end
    end

    context "with data" do
      let!(:user1) { create(:user) }
      let!(:user2) { create(:user) }
      let!(:org1) { create(:organization) }
      let!(:org2) { create(:organization) }
      let!(:cp1) { create(:configuration_profile, :active) }
      let!(:cp2) { create(:configuration_profile, :deactivated) }

      before do
        # user1 in cp1 (org1, org2) and cp2 (org2)
        create(:configuration_profile_user, user: user1, configuration_profile: cp1, organization: org1)
        create(:configuration_profile_user, user: user1, configuration_profile: cp2, organization: org2)
        # user2 in cp2 (org2)
        create(:configuration_profile_user, user: user2, configuration_profile: cp2, organization: org2)
      end

      context "without filters" do
        it "returns a relation with all users" do
          expect(subject).to include(user1, user2)
        end
      end

      context "with filter by organization" do
        let(:params) { { organization_ids: [org1.id] } }

        it "returns a relation with the users in the organization" do
          expect(subject).to include(user1)
        end
      end

      context "with filter by configuration profile" do
        let(:params) { { configuration_profile_ids: [cp2.id] } }

        it "returns a relation with the users in the configuration profile" do
          expect(subject).to include(user1, user2)
        end
      end

      context "with search" do
        let(:params) { { search: user1.fullname } }

        it "returns a relation with the users that match the search" do
          expect(subject).to include(user1)
        end
      end

      context "with search and filters" do
        let(:params) { { search: user1.fullname, organization_ids: [org1.id] } }

        it "returns a relation with the users that match the search and the organization" do
          expect(subject).to include(user1)
        end
      end
    end
  end
end
