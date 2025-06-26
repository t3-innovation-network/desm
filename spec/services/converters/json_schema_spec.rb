# frozen_string_literal: true

require "rails_helper"

RSpec.describe Converters::JsonSchema do
  describe ".convert" do
    let(:graph) { result.fetch(:@graph) }
    let(:result) { described_class.convert(file) }

    let(:file) do
      Rack::Test::UploadedFile.new(file_fixture(schema_file))
    end

    context "with enums" do
      let(:schema_file) { "color-enum+meta.json" }

      it_behaves_like "valid JSON-LD conversion"

      it "includes the enum values in the graph" do
        expect(graph.map { |r| r[:@type] }.uniq).to include("skos:ConceptScheme")
        expect(graph.map { |r| r[:@type] }.uniq).to include("skos:Concept")

        concepts = graph.select { |r| r[:@type] == "skos:Concept" }
        expect(concepts.size).to eq(3)
        expect(concepts.map { |c| c[:"skos:prefLabel"] }).to match_array(%w(r g b))
        expect(concepts.map { |c| c[:"skos:definition"] }).to all include("The colour")
      end
    end

    context "with OneOf" do
      let(:schema_file) { "color-OneOf.json" }

      it_behaves_like "valid JSON-LD conversion"

      it "includes the OneOf values in the graph" do
        expect(graph.map { |r| r[:@type] }.uniq).to include("skos:ConceptScheme")
        expect(graph.map { |r| r[:@type] }.uniq).to include("skos:Concept")

        concepts = graph.select { |r| r[:@type] == "skos:Concept" }
        expect(concepts.size).to eq(3)
        expect(concepts.map { |c| c[:"skos:prefLabel"] }).to match_array(%w(green blue red))
        expect(concepts.map { |c| c[:"skos:definition"] }).to all include("The colour")
      end
    end

    context "with AnyOf" do
      let(:schema_file) { "color-AnyOf.json" }

      it_behaves_like "valid JSON-LD conversion"

      it "includes the AnyOf values in the graph" do
        expect(graph.map { |r| r[:@type] }.uniq).to include("skos:ConceptScheme")
        expect(graph.map { |r| r[:@type] }.uniq).to include("skos:Concept")

        concepts = graph.select { |r| r[:@type] == "skos:Concept" }
        expect(concepts.size).to eq(3)
        expect(concepts.map { |c| c[:"skos:prefLabel"] }).to match_array(%w(green blue red))
        expect(concepts.map { |c| c[:"skos:definition"] }).to all include("The colour")
      end
    end
  end
end
