# frozen_string_literal: true

require "rails_helper"

describe Slugable do
  let!(:dummy) { create(:configuration_profile, :basic, name: "Test Name") }

  describe "#generate_slug" do
    it "generates a slug based on the name" do
      expect(dummy.slug).to eq("Test+Name")
    end
  end

  describe "#uri" do
    it "returns the URI for the resource" do
      expect(dummy.uri).to eq("#{Desm::APP_DOMAIN}/resources/configuration-profiles/Test+Name")
    end
  end

  describe ".decode_safe_uri" do
    it "decodes a uri safe string with converting space to +" do
      expect(Slugable.decode_safe_uri("Test Name")).to eq("Test+Name")
      expect(Slugable.decode_safe_uri("Test%20Name")).to eq("Test+Name")
    end
  end
end
