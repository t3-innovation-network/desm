# frozen_string_literal: true

require "rails_helper"

describe "API::V1::Predicates", type: :request do
  let(:user) { create(:user) }
  let(:configuration_profile) { create(:configuration_profile, :basic) }

  describe "GET /api/v1/predicates" do
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
  end
end
