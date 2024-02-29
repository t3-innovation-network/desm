# frozen_string_literal: true

require "rails_helper"

describe "API::V1::Terms", type: :request do
  let(:user) { create(:user) }
  let(:configuration_profile) { create(:configuration_profile, :basic) }

  describe "GET /api/v1/specifications/:id/terms" do
    context "without specification" do
      before { get api_v1_specification_terms_path(2) }

      it_behaves_like "api not found"
    end

    context "when user is authenticated" do
      let(:configuration_profile_user) { create(:configuration_profile_user, user:, configuration_profile:) }
      let(:specification) { create(:specification, :with_terms, configuration_profile_user:) }

      before do
        stub_authentication_for(user, configuration_profile:)
        get api_v1_specification_terms_path(specification.id)
      end

      it "returns terms" do
        expect(response).to have_http_status(:ok)
        expect(json_parse(response.body).length).to eq 1
      end
    end
  end

  describe "GET /api/v1/terms/:id" do
    let(:configuration_profile_user) { create(:configuration_profile_user, user:, configuration_profile:) }
    let(:term) { create(:term, configuration_profile_user:) }

    before do
      stub_authentication_for(user, configuration_profile:)
      get api_v1_term_path(term.id)
    end

    it "returns term" do
      expect(response).to have_http_status(:ok)
      data = json_parse(response.body)
      expect(data[:id]).to eq term.id
      expect(data[:name]).to eq term.name
    end
  end
end
