# frozen_string_literal: true

require "rails_helper"

RSpec.describe Parsers::Skos do
  describe ".scheme_nodes" do
    let(:file_content) { File.read(file) }
    let(:file) do
      Rack::Test::UploadedFile.new(
        Rails.root.join("spec", "fixtures", "DisabilityLevelCodeList.json")
      )
    end

    it "returns a list of one only node" do
      parser = described_class.new(file_content: file_content)
      result = parser.scheme_nodes

      expect(result.count).to eq(1)
    end
  end

  describe ".concepts_list_simplified" do
    let(:file_content) { File.read(file) }
    let(:file) do
      Rack::Test::UploadedFile.new(
        Rails.root.join("spec", "fixtures", "DisabilityLevelCodeList.json")
      )
    end

    it "returns a formatted list of concepts" do
      parser = described_class.new(file_content: file_content)
      result = parser.concepts_list_simplified

      expect(result.count).to eq(parser.graph.count)
      expect(result.first).to have_key(:id)
      expect(result.first).to have_key(:definition)
      expect(result.first).to have_key(:uri)
    end
  end
end
