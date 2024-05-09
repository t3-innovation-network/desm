# frozen_string_literal: true

require "rails_helper"

describe "API::V1::ConfigurationProfiles", type: :request do
  let(:user) { create(:user) }

  describe "GET /api/v1/configuration_profiles" do
    let(:configuration_profile) { create(:configuration_profile, :basic) }

    context "when user is not authenticated" do
      before { get api_v1_mappings_path }

      it_behaves_like "api authorization error"
    end

    context "when user is admin" do
      let(:user) { create(:user, :admin) }

      before do
        stub_authentication_for(user)
        get api_v1_configuration_profiles_path
      end

      it "returns empty array" do
        expect(response).to have_http_status(:ok)
        expect(json_parse(response.body)).to be_empty
      end
    end

    context "when user is mapper" do
      let!(:configuration_profile_user) { create(:configuration_profile_user, user:, configuration_profile:) }

      before do
        stub_authentication_for(user, configuration_profile:)
        get api_v1_configuration_profiles_path
      end

      it_behaves_like "api authorization error"
    end
  end

  shared_context "configuration profiles with and without mappings" do
    let(:configuration_profile) { create(:configuration_profile, :basic, :active) }
    let!(:configuration_profile_user) { create(:configuration_profile_user, user:, configuration_profile:) }
    let(:configuration_profile1) { create(:configuration_profile, :basic, :deactivated) }
    let!(:configuration_profile_user1) do
      create(:configuration_profile_user, user:, configuration_profile: configuration_profile1)
    end
    let(:configuration_profile2) { create(:configuration_profile, :basic, :active) }
    let!(:configuration_profile_user2) do
      create(:configuration_profile_user, user:, configuration_profile: configuration_profile2)
    end
    let!(:mapping1) { create(:mapping, :uploaded, configuration_profile_user:) }
    let!(:mapping) { create(:mapping, :mapped, configuration_profile_user: configuration_profile_user2) }
  end

  describe "GET /api/v1/configuration_profiles/index_for_user" do
    include_context "configuration profiles with and without mappings"

    before do
      stub_authentication_for(user, configuration_profile:)
      get index_for_user_api_v1_configuration_profiles_path
    end

    it "returns user's active configuration profiles" do
      expect(response).to have_http_status(:ok)
      data = json_parse(response.body)
      expect(data.size).to eq 2
      results = [{ cp: configuration_profile, mappings: false },
                 { cp: configuration_profile2, mappings: true }].sort_by do |r|
        r[:cp].name
      end
      results.each_with_index do |result, index|
        expect(data[index][:id]).to eq result[:cp].id
        expect(data[index][:name]).to eq result[:cp].name
        expect(data[index][:with_shared_mappings]).to eq result[:mappings]
      end
    end
  end

  describe "GET /api/v1/configuration_profiles/index_shared_mappings" do
    include_context "configuration profiles with and without mappings"

    before do
      get index_shared_mappings_api_v1_configuration_profiles_path
    end

    it "returns configuration profiles with shared mappings" do
      expect(response).to have_http_status(:ok)
      data = json_parse(response.body)
      expect(data.size).to eq 1
      expect(data[0][:id]).to eq configuration_profile2.id
      expect(data[0][:name]).to eq configuration_profile2.name
      expect(data[0][:with_shared_mappings]).to be_truthy
    end
  end
end
