# frozen_string_literal: true

RSpec.configure do
  shared_examples "valid JSON-LD conversion" do |missed_types = []|
    it "converts the schema to JSON-LD" do
      expect(result.keys).to eq(%i(@context @graph))
      expect(result.fetch(:@context)).to eq(
        dct: "http://purl.org/dc/terms/",
        desm: "http://desmsolutions.org/ns/",
        rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
        rdfs: "http://www.w3.org/2000/01/rdf-schema#",
        skos: "http://www.w3.org/2004/02/skos/core#"
      )
      expect(graph.map { |r| r[:@type] }.uniq.sort).to match_array(
        %w(rdf:Class rdf:Property skos:Concept skos:ConceptScheme) - missed_types
      )
      expect(graph.uniq.size).to eq(graph.size)
    end
  end
end
