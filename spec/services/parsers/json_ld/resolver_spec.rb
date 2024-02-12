# frozen_string_literal: true

require "rails_helper"

RSpec.describe Parsers::JsonLd::Resolver do
  describe ".infer_rdfs_class_node Schema.org" do
    subject { described_class.new(type, context) }

    let(:type) { "http://schema.org/EventStatusType" }
    let(:context) do
      {
        rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
        rdfs: "http://www.w3.org/2000/01/rdf-schema#",
        xsd: "http://www.w3.org/2001/XMLSchema#"
      }
    end

    it "returns rdfs:Class type node for a not directly declared class (infer using the internet)" do
      result_node = subject.infer_rdfs_class_node

      expect(result_node).not_to be_nil
      expect(Parsers::JsonLd::Node.new(result_node).types.rdfs_class?).to be(true)
    end
  end

  describe ".infer_rdfs_class_node ASN" do
    subject { described_class.new(type, context) }

    let(:type) { "asn:Statement" }
    let(:context) do
      {
        dc: "http://purl.org/dc/elements/1.1/",
        asn: "http://purl.org/ASN/schema/core/",
        loc: "http://www.loc.gov/loc.terms/relators/",
        owl: "http://www.w3.org/2002/07/owl#",
        rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
        rdfs: "http://www.w3.org/2000/01/rdf-schema#",
        skos: "http://www.w3.org/2004/02/skos/core#",
        vann: "http://purl.org/vocab/vann/",
        schema: "http://schema.org/",
        dcterms: "http://purl.org/dc/terms/"
      }
    end

    # ASN server is down.
    # @todo: Use VCR to test it when server is up again
    it "uses the context to properly fetch the type from the internet" do
      result_node = subject.infer_rdfs_class_node

      expect(subject.full_definition_uri).to eq("http://purl.org/ASN/schema/core/Statement")
      expect(result_node).not_to be_nil
      expect(Parsers::JsonLd::Node.new(result_node).types.rdfs_class?).to be(true)
    end
  end
end
