# frozen_string_literal: true

require "rails_helper"

describe "Admin::Users", type: :request do
  describe "GET /index" do
    it "returns http success" do
      get "/admin/users/index"

      expect(response).to have_http_status(302)
    end
  end

  describe "GET /new" do
    it "returns http success" do
      get "/admin/users/new"

      expect(response).to have_http_status(302)
    end
  end

  describe "POST /create" do
    it "returns http success" do
      params = {
        email: "user@requesttest.com",
        password: "123123123",
        organization_id: 1
      }

      post "/admin/users", params: params

      expect(response).to have_http_status(302)
    end
  end

  describe "GET /show" do
    it "returns http success" do
      get "/admin/users/show"

      expect(response).to have_http_status(302)
    end
  end

  describe "GET /edit" do
    it "returns http success" do
      get "/admin/users/edit"

      expect(response).to have_http_status(302)
    end
  end

  describe "PUT /update" do
    it "returns http success" do
      params = {
        name: "updated user"
      }

      put "/admin/users/1", params: params

      expect(response).to have_http_status(302)
    end
  end

  describe "DELETE /destroy" do
    it "returns http success" do
      delete "/admin/users/1"

      expect(response).to have_http_status(302)
    end
  end
end
