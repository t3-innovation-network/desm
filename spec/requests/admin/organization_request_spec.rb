# frozen_string_literal: true

require "rails_helper"

describe "Admin::Organizations", type: :request do
  describe "GET /" do
    it "returns http success" do
      get "/admin/organizations"

      expect(response).to have_http_status(302)
    end
  end

  describe "GET /new" do
    it "returns http success" do
      get "/admin/organizations/new"

      expect(response).to have_http_status(302)
    end
  end

  describe "POST /organizations" do
    it "returns http success" do
      params = {
        name: "test organization"
      }

      post "/admin/organizations", params: params

      expect(response).to have_http_status(302)
    end
  end

  describe "GET /edit" do
    it "returns http success" do
      get "/admin/organizations/1/edit"

      expect(response).to have_http_status(302)
    end
  end

  describe "PUT /organizations/{id}" do
    it "returns http success" do
      params = {
        name: "updated test organization"
      }

      put "/admin/organizations/1", params: params

      expect(response).to have_http_status(302)
    end
  end

  describe "DELETE organization" do
    it "returns http success" do
      delete "/admin/organizations/1"

      expect(response).to have_http_status(302)
    end
  end

  describe "Can't DELETE organization with users" do
    let(:o) { FactoryBot.build(:organization) }

    it "returns http success" do
      FactoryBot.build(:user, organization: o)

      delete "/admin/organizations/#{o.id}/"

      expect(response).to have_http_status(302)
      expect(o).to be_present
    end
  end
end
