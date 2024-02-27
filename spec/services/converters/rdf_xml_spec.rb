# frozen_string_literal: true

require "rails_helper"

RSpec.describe Converters::RdfXml do
  describe ".convert" do
    let(:graph) { result.fetch(:@graph) }
    let(:result) { described_class.convert(file) }

    let(:file) do
      Rack::Test::UploadedFile.new(file_fixture(filename))
    end

    context "ASN" do
      let(:filename) { "ASN_D2695955.rdf" }

      it "converts RDF/XML to JSON-LD" do
        expect(result.keys).to eq(%i(@context @graph))

        expect(result.fetch(:@context)).to eq(
          "asn" => "http://purl.org/ASN/schema/core/",
          "cc" => "http://creativecommons.org/ns#",
          "dc" => "http://purl.org/dc/elements/1.1/",
          "dcterms" => "http://purl.org/dc/terms/",
          "foaf" => "http://xmlns.com/foaf/0.1/",
          "gemq" => "http://purl.org/gem/qualifiers/",
          "loc" => "http://www.loc.gov/loc.terms/relators/",
          "owl" => "http://www.w3.org/2002/07/owl#",
          "skos" => "http://www.w3.org/2004/02/skos/core#",
          "rdf" => "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
          "rdfs" => "http://www.w3.org/2000/01/rdf-schema#"
        )

        expect(graph.map { |r| r["@type"] }.uniq.compact).to match_array(
          %w(asn:Statement asn:StandardDocument)
        )

        expect(graph.uniq.size).to eq(graph.size)
      end
    end

    context "Darwin Core" do
      let(:filename) { "dwcterms.rdf" }

      it "converts RDF/XML to JSON-LD" do
        expect(result.keys).to eq(%i(@context @graph))

        expect(result.fetch(:@context)).to eq(
          "dwcattributes" => "http://rs.tdwg.org/dwc/terms/attributes/",
          "dcterms" => "http://purl.org/dc/terms/",
          "rdf" => "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
          "rdfs" => "http://www.w3.org/2000/01/rdf-schema#"
        )

        expect(graph.map { |r| r["@type"] }.uniq.compact.sort).to match_array(
          %w(rdf:Property rdfs:Class)
        )

        expect(graph.uniq.size).to eq(graph.size)
      end
    end
  end
end
