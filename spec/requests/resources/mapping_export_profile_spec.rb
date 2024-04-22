# frozen_string_literal: true

require "rails_helper"

describe "Resources::MappingExportProfile", type: :request do
  describe "GET /resources/configuration-profiles/:configuration_profile_id/mapping_export_profile/:slug" do
    let(:domain_slug) { "domain-slug" }
    let(:configuration_profile_id) { 1 }
    subject do
      get resources_configuration_profile_mapping_export_profile_path(slug: domain_slug, configuration_profile_id:)
    end

    context "when user is not authenticated" do
      before { subject }

      it_behaves_like "api authorization error"
    end

    context "withouth configuration profile" do
      let(:user) { create(:user) }

      before do
        stub_authentication_for(user)
        subject
      end

      it "returns not found error" do
        expect(response).to have_http_status(:not_found)
      end
    end

    context "with configuration profile" do
      let(:user) { create(:user, :admin) }
      let(:configuration_profile) { create(:configuration_profile) }
      let(:configuration_profile_id) { configuration_profile.id }
      let(:domain) { create(:domain, domain_set:) }
      let(:domain_slug) { domain.slug }

      before do
        stub_authentication_for(user)
      end

      context "when domain within configuration profile scope" do
        let(:domain_set) { create(:domain_set, configuration_profile:) }

        before do
          # expect this call to be made
          allow(Exporters::MappingExportProfile).to receive(:new).and_return(double(export: {}))
          subject
        end

        it "returns domain" do
          expect(response).to have_http_status(:ok)
        end
      end

      context "when domain is outside configuration profile scope" do
        let(:domain_set) { create(:domain_set) }

        it "returns not found error" do
          subject
          expect(response).to have_http_status(:not_found)
        end
      end
    end
  end
end
