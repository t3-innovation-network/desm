# frozen_string_literal: true

require "rails_helper"

describe "API::V1::SpineTerms", type: :request do
  let(:user) { create(:user) }
  let(:configuration_profile) { create(:configuration_profile) }

  describe "GET /api/v1/spines/:id/terms" do
    context "without spine" do
      before { get api_v1_spine_terms_list_path(2) }

      it_behaves_like "api not found"
    end

    context "when user is authenticated" do
      let(:configuration_profile_user) { create(:configuration_profile_user, user:, configuration_profile:) }
      let(:spine) { create(:spine, :with_terms, configuration_profile_user:) }

      before do
        stub_authentication_for(user, configuration_profile:)
        get api_v1_spine_terms_list_path(spine.id)
      end

      it "returns terms" do
        expect(response).to have_http_status(:ok)
        expect(json_parse(response.body).length).to eq 1
      end
    end
  end
end
