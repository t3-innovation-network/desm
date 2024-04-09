# frozen_string_literal: true

require "rails_helper"

describe "API::V1::Mappings", type: :request do
  let(:user) { create(:user) }
  let(:configuration_profile) { create(:configuration_profile, :basic) }

  describe "GET /api/v1/mappings" do
    context "when user is not authenticated" do
      before { get api_v1_mappings_path }

      it_behaves_like "api authorization error"
    end

    context "when user is admin" do
      let(:user) { create(:user, :admin) }

      before do
        stub_authentication_for(user)
        get api_v1_mappings_path
      end

      it "returns empty array" do
        expect(response).to have_http_status(:ok)
        expect(json_parse(response.body)).to be_empty
      end
    end

    context "when user is mapper" do
      let!(:configuration_profile_user) { create(:configuration_profile_user, user:, configuration_profile:) }
      let!(:mapping) { create(:mapping, configuration_profile_user:) }

      before do
        stub_authentication_for(user, configuration_profile:)
        get api_v1_mappings_path
      end

      it "returns mappings" do
        expect(response).to have_http_status(:ok)
        data = json_parse(response.body)
        expect(data.size).to eq 1
        expect(data[0][:id]).to eq mapping.id
        expect(data[0][:title]).to eq mapping.title
      end
    end
  end

  describe "GET /api/v1/mappings/:id" do
    let(:configuration_profile_user) { create(:configuration_profile_user, user:, configuration_profile:) }
    let(:mapping) { create(:mapping, configuration_profile_user:) }

    before do
      stub_authentication_for(user, configuration_profile:)
      get api_v1_mapping_path(mapping.id)
    end

    it "returns the mapping" do
      expect(response).to have_http_status(:ok)
      data = json_parse(response.body)
      expect(data[:id]).to eq mapping.id
      expect(data[:title]).to eq mapping.title
    end
  end

  describe "GET /api/v1/mappings/:id/show_terms" do
    let(:configuration_profile_user) { create(:configuration_profile_user, user:, configuration_profile:) }
    let(:mapping) { create(:mapping, configuration_profile_user:) }
    let!(:alignment) { create(:alignment, mapping:) }

    before do
      stub_authentication_for(user, configuration_profile:)
      get api_v1_mapping_terms_path(mapping.id)
    end

    it "returns mapping alignments" do
      expect(response).to have_http_status(:ok)
      data = json_parse(response.body)
      expect(data[0][:id]).to eq alignment.id
      expect(data[0][:mapping_id]).to eq mapping.id
    end
  end
end
