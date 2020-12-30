# frozen_string_literal: true

require "rails_helper"

RSpec.describe Converters::RdfXml do
  describe ".convert" do
    let(:graph) { result.fetch(:@graph) }
    let(:result) { described_class.convert(file) }

    let(:file) do
      Rack::Test::UploadedFile.new(
        Rails.root.join("spec", "fixtures", "dwcterms.rdf")
      )
    end

    it "converts RDF/XML to JSON-LD" do
      expect(result.keys).to eq(%i[@context @graph])

      expect(result.fetch(:@context)).to eq(
        "dwcattributes" => "http://rs.tdwg.org/dwc/terms/attributes/",
        "dcterms" => "http://purl.org/dc/terms/",
        "rdf" => "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
        "rdfs" => "http://www.w3.org/2000/01/rdf-schema#"
      )

      expect(graph.map {|r| r["@type"] }.uniq.compact).to match(
        %w[rdf:Property rdfs:Class]
      )

      expect(graph.uniq.size).to eq(graph.size)
    end
  end
end
