# frozen_string_literal: true

require "rails_helper"

describe "API::V1::Predicates", type: :request do
  let(:user) { create(:user) }
  let(:configuration_profile) { create(:configuration_profile, :basic) }

  describe "GET /api/v1/predicates" do
    context "when user is not authenticated" do
      before { get api_v1_predicates_path }

      it_behaves_like "api authorization error"
    end

    context "when user is authenticated" do
      before do
        stub_authentication_for(user, configuration_profile:)
        get api_v1_predicates_path
      end

      it "returns empty array" do
        expect(response).to have_http_status(:ok)
        expect(json_parse(response.body)).to be_empty
      end
    end

    context "when configuration profile passed as parameter" do
      subject { get api_v1_predicates_path, params: { configuration_profile_id: configuration_profile.id } }

      context "with configuration profile with shared mappings" do
        let(:configuration_profile) { create(:configuration_profile, :active, :basic) }
        let(:configuration_profile_user) { create(:configuration_profile_user, user:, configuration_profile:) }
        let!(:mapping) { create(:mapping, :mapped, configuration_profile_user:) }

        it "returns empty array" do
          subject
          expect(response).to have_http_status(:ok)
          expect(json_parse(response.body)).to be_empty
        end
      end

      context "with configuration profile without shared mappings" do
        before do
          subject
        end

        it_behaves_like "api authorization error"
      end
    end
  end
end
