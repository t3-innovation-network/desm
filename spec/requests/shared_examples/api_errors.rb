# frozen_string_literal: true

RSpec.configure do
  shared_examples "api not found" do
    it "returns not found" do
      expect(response).to have_http_status(:not_found)
    end
  end

  shared_examples "api authorization error" do
    it "returns unauthorized" do
      expect(response).to have_http_status(:unauthorized)
      json = json_parse(response.body)
      expect(json[:error]).not_to be_empty
    end
  end

  shared_examples "api unprocessable entity" do
    it "returns unprocessable entity" do
      expect(response).to have_http_status(:unprocessable_entity)
      json = json_parse(response.body)
      expect(json[:errors]).not_to be_empty
    end
  end
end
