# frozen_string_literal: true

require "rails_helper"

describe "Admin::Companies", type: :request do
  describe "GET /index" do
    it "returns http success" do
      get "/admin/companies/index"

      expect(response).to have_http_status(302)
    end
  end

  describe "GET /new" do
    it "returns http success" do
      get "/admin/companies/new"

      expect(response).to have_http_status(302)
    end
  end

  describe "POST /companies" do
    it "returns http success" do
      params = {
        name: "test company"
      }

      post "/admin/companies", params: params

      expect(response).to have_http_status(302)
    end
  end

  describe "GET /show" do
    it "returns http success" do
      get "/admin/companies/show"

      expect(response).to have_http_status(302)
    end
  end

  describe "GET /edit" do
    it "returns http success" do
      get "/admin/companies/edit"

      expect(response).to have_http_status(302)
    end
  end

  describe "PUT /companies/{id}" do
    it "returns http success" do
      params = {
        name: "updated test company"
      }

      put "/admin/companies/1", params: params

      expect(response).to have_http_status(302)
    end
  end

  describe "DELETE /destroy" do
    it "returns http success" do
      get "/admin/companies/destroy"

      expect(response).to have_http_status(302)
    end
  end
end
