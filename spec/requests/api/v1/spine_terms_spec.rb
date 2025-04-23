# frozen_string_literal: true

require "rails_helper"

describe "API::V1::SpineTerms", type: :request do
  let(:user) { create(:user) }
  let(:configuration_profile) { create(:configuration_profile) }

  before do
    stub_authentication_for(user, configuration_profile:)
  end

  describe "GET /api/v1/spines/:id/terms" do
    context "without spine" do
      before { get api_v1_spine_terms_list_path(2) }

      it_behaves_like "api not found"
    end

    context "when user is authenticated" do
      let(:configuration_profile_user) { create(:configuration_profile_user, user:, configuration_profile:) }
      let(:spine) { create(:spine, :with_terms, configuration_profile_user:) }

      before do
        get api_v1_spine_terms_list_path(spine.id)
      end

      it "returns terms" do
        expect(response).to have_http_status(:ok)
        expect(json_parse(response.body).length).to eq 1
      end
    end

    context "when configuration profile passed as parameter" do
      let(:spine) { create(:spine, :with_terms) }

      subject do
        get api_v1_spine_terms_list_path(spine.id), params: { configuration_profile_id: configuration_profile.id }
      end

      context "with configuration profile with shared mappings" do
        let(:configuration_profile) { create(:configuration_profile, :active) }
        let(:configuration_profile_user) { create(:configuration_profile_user, user:, configuration_profile:) }
        let!(:mapping) { create(:mapping, :mapped, configuration_profile_user:) }
        let!(:spine) { create(:spine, :with_terms, configuration_profile_user:) }

        it "returns terms" do
          subject
          expect(response).to have_http_status(:ok)
          expect(json_parse(response.body).length).to eq 1
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
