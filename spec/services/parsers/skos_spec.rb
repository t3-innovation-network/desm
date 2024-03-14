# frozen_string_literal: true

require "rails_helper"

RSpec.describe Parsers::Skos do
  let(:file_content) { File.read(file) }
  let(:file) do
    Rack::Test::UploadedFile.new(file_fixture("desmMappingPredicates.json"))
  end

  describe ".scheme_nodes" do
    it "returns a list of one only node" do
      parser = described_class.new(file_content:)
      result = parser.scheme_nodes

      expect(result.count).to eq(1)
    end
  end

  describe ".concepts_list_simplified" do
    it "returns a formatted list of concepts" do
      parser = described_class.new(file_content:)
      result = parser.concepts_list_simplified

      expect(result.count).to eq(parser.graph.count)
      expect(result.first).to have_key(:id)
      expect(result.first).to have_key(:definition)
      expect(result.first).to have_key(:uri)
    end
  end

  describe ".concept_names" do
    it "returns an array of strings with the concept labels" do
      parser = described_class.new(file_content:)
      result = parser.concept_names

      expect(result.count).to eq(parser.graph.count - 1)
      expect(result.first[:label]).to eq("Aggregated")
    end
  end

  describe ".valid_skos" do
    context "with multiple nodes" do
      it "returns true for a valid skos file" do
        parser = described_class.new(file_content:)
        result = parser.valid_skos?

        expect(result).to be_truthy
      end
    end

    context "with a single node" do
      let(:file_content) { Converters::Turtle.convert(file) }
      let(:file) do
        Rack::Test::UploadedFile.new(file_fixture("singleAbstractClass.ttl"))
      end

      it "returns true for a valid skos file" do
        parser = described_class.new(file_content:)
        result = parser.valid_skos?

        expect(result).to be_truthy
      end
    end

    it "returns false for an invalid file" do
      parser = described_class.new(file_content: { name: "test" })
      result = parser.valid_skos?

      expect(result).to be_falsey
    end
  end

  describe ".build_skos" do
    it "returns a valid skos file" do
      parser = described_class.new(file_content:)
      result = parser.build_skos

      expect(result).to have_key(:@context)
      expect(result).to have_key(:@graph)
      expect(result[:@graph].count).to eq(parser.graph.count)
    end

    it "raises InvalidSkosFile when the skos file is invalid" do
      invalid_file_content = {
        example: "of",
        invalid: "content"
      }

      parser = described_class.new(file_content: invalid_file_content)
      expect { parser.build_skos }.to raise_error Parsers::InvalidSkosFile
    end
  end
end
