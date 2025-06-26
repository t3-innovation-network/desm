# frozen_string_literal: true

require "rails_helper"

RSpec.describe Converters::XmlSchema do
  describe ".convert" do
    let(:graph) { result.fetch(:@graph) }
    let(:result) { described_class.convert(file) }
    let(:file) do
      Rack::Test::UploadedFile.new(file_fixture(schema_file))
    end

    context "when converting an XML schema file" do
      let(:schema_file) { "pesc.xml" }

      it_behaves_like "valid JSON-LD conversion"
    end

    context "when converting XSD with complext types and enumerations" do
      let(:schema_file) { "simpleEnum.xsd" }

      it_behaves_like "valid JSON-LD conversion", %w(rdf:Class)

      it "includes the enumeration values in the graph" do
        expect(graph.map { |r| r[:@type] }.uniq).to include("skos:ConceptScheme")
        expect(graph.map { |r| r[:@type] }.uniq).to include("skos:Concept")

        concepts = graph.select { |r| r[:@type] == "skos:Concept" }
        expect(concepts.size).to eq(3)
        expect(concepts.map { |c| c[:"skos:prefLabel"] }).to match_array(%w(red green blue))
      end
    end

    context "when converting XSD with simple types enumerations" do
      let(:schema_file) { "StateProvinceElement.xsd" }

      it_behaves_like "valid JSON-LD conversion", %w(rdf:Class rdf:Property)

      it "includes the enumeration values in the graph" do
        expect(graph.map { |r| r[:@type] }.uniq).to include("skos:ConceptScheme")
        expect(graph.map { |r| r[:@type] }.uniq).to include("skos:Concept")

        concepts = graph.select { |r| r[:@type] == "skos:Concept" }
        expect(concepts.size).to eq(77)
        expect(concepts.map { |c| c[:"skos:prefLabel"] }).to include("AA", "AK", "VA")
      end
    end
  end
end
