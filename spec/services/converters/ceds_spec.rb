# frozen_string_literal: true

require "rails_helper"

RSpec.describe Converters::Ceds do
  describe ".convert" do
    let(:graph) { result.fetch(:@graph) }
    let(:result) { described_class.convert(file) }
    let(:file) do
      Rack::Test::UploadedFile.new(file_fixture(schema_file))
    end

    context "when converting CSV schema file" do
      let(:schema_file) { "ceds.csv" }

      it_behaves_like "valid JSON-LD conversion"
    end

    context "when converting CSV schema file with vocabulary" do
      let(:schema_file) { "ceds-ex1.csv" }

      it_behaves_like "valid JSON-LD conversion", %w(rdf:Class rdf:Property)

      it "includes vocabulary and it's concepts" do
        vocabularies = graph.select { |r| r[:@type] == "skos:ConceptScheme" }
        expect(vocabularies.size).to eq(1)
        expect(vocabularies.map { |v| v[:"dct:title"] }.uniq).to include("Organization Operational Status")
        expect(vocabularies.map { |v| v[:"dct:creator"] }.uniq).to include("CEDS")

        concepts = graph.select { |r| r[:@type] == "skos:Concept" }
        expect(concepts.size).to eq(2)
        expect(concepts.map { |c| c[:"skos:prefLabel"] }).to match_array(%w(Active Inactive))
        expect(concepts.map do |c|
          c[:"skos:definition"][:en]
        end).to all include("The organization is")
        expect(concepts.to_set { |c| c[:"skos:inScheme"] }).to eq(Set.new(vocabularies.map { |v| v[:@id] }))
        expect(concepts.map { |c| c[:"skos:notation"] }).to match_array(%w(Active Inactive))
      end
    end

    context "when converting CSV schema file with multiple vocabularies" do
      let(:schema_file) { "ceds-ex2.csv" }

      it_behaves_like "valid JSON-LD conversion", %w(rdf:Class rdf:Property)

      it "includes vocabularies and their concepts" do
        vocabularies = graph.select { |r| r[:@type] == "skos:ConceptScheme" }
        expect(vocabularies.size).to eq(2)
        expect(vocabularies.map do |v|
          v[:"dct:title"]
        end.uniq).to include("Education Verification Method", "Facility Joint Development Type")
        expect(vocabularies.map { |v| v[:"dct:creator"] }.uniq).to include("CEDS")

        concepts = graph.select { |r| r[:@type] == "skos:Concept" }
        expect(concepts.size).to eq(7)
        expect(concepts.map { |c| c[:"skos:prefLabel"] }).to match_array(["Official Transcript",
                                                                          "Transcript Copy",
                                                                          "Degree Copy",
                                                                          "Grade Report",
                                                                          "Other",
                                                                          "Dedicated",
                                                                          "Shared"])
      end
    end
  end
end
