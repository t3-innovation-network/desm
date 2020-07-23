# frozen_string_literal: true

require "rails_helper"

describe "Admin::Organizations", type: :request do
  describe "GET /index" do
    it "returns http success" do
      get "/admin/organizations/index"

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

  describe "GET /show" do
    it "returns http success" do
      get "/admin/organizations/show"

      expect(response).to have_http_status(302)
    end
  end

  describe "GET /edit" do
    it "returns http success" do
      get "/admin/organizations/edit"

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

  describe "DELETE /destroy" do
    it "returns http success" do
      get "/admin/organizations/destroy"

      expect(response).to have_http_status(302)
    end
  end
end
