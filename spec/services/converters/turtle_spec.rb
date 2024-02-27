# frozen_string_literal: true

require "rails_helper"

RSpec.describe Converters::Turtle do
  describe ".convert" do
    let(:graph) { result.fetch(:@graph) }
    let(:result) { described_class.convert(file) }

    let(:file) do
      Rack::Test::UploadedFile.new(file_fixture(filename))
    end

    context "N-Triples" do
      let(:filename) { "ASN_D2695955.nt" }

      it "converts N-Triples to JSON-LD" do
        expect(result.keys).to eq(%i(@graph))

        expect(graph.map do |r|
                 r["@type"]
               end.uniq.compact).to contain_exactly("http://purl.org/ASN/schema/core/Statement", "http://purl.org/ASN/schema/core/StandardDocument")

        expect(graph.uniq.size).to eq(graph.size)
      end
    end

    context "Turtle" do
      let(:filename) { "ASN_D2695955.ttl" }

      it "converts Turtle to JSON-LD" do
        expect(result.keys).to eq(%i(@context @graph))

        expect(result.fetch(:@context)).to eq(
          "asn" => "http://purl.org/ASN/schema/core/",
          "cc" => "http://creativecommons.org/ns#",
          "dc" => "http://purl.org/dc/elements/1.1/",
          "dcterms" => "http://purl.org/dc/terms/",
          "foaf" => "http://xmlns.com/foaf/0.1/",
          "gemq" => "http://purl.org/gem/qualifiers/",
          "loc" => "http://www.loc.gov/loc.terms/relators/",
          "rdf" => "http://www.w3.org/1999/02/22-rdf-syntax-ns#"
        )

        expect(graph.map { |r| r["@type"] }.uniq.compact).to match_array(
          %w(asn:Statement asn:StandardDocument)
        )

        expect(graph.uniq.size).to eq(graph.size)
      end
    end
  end
end
