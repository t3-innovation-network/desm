# frozen_string_literal: true

require "rails_helper"

RSpec.describe Utils do
  describe ".compact_uri" do
    context "compact URI" do
      it "does nothing" do
        expect(Utils.compact_uri("sdo:Organization")).to eq("sdo:Organization")
      end
    end

    context "full DESM URI" do
      context "with non-RDF" do
        it "returns original value" do
          expect(Utils.compact_uri("http://desmsolutions.org/ns/f401/Program")).to eq("Program")
        end
      end

      context "without non-RDF" do
        it "returns original value" do
          expect(Utils.compact_uri("http://desmsolutions.org/ns/f401/Program", non_rdf: false)).to eq("http://desmsolutions.org/ns/f401/Program")
        end
      end
    end

    context "full URI" do
      context "from context" do
        it "returns compact URI" do
          expect(Utils.compact_uri("http://www.w3.org/2001/XMLSchema#anyURI")).to eq("xsd:anyURI")
        end
      end

      context "with custom context" do
        it "returns compact URI" do
          expect(Utils.compact_uri("http://xmlns.com/foaf/0.1/Person",
                                   context: { foaf: "http://xmlns.com/foaf/0.1/" })).to eq("foaf:Person")
        end
      end

      context "not from context" do
        it "returns as is" do
          expect(Utils.compact_uri("http://example.org/Person")).to eq("http://example.org/Person")
        end
      end
    end
  end
end
