# frozen_string_literal: true

require "rails_helper"

RSpec.describe Parsers::JsonLd::Node do
  describe "read!" do
    subject { described_class.new(schema_node) }

    let(:schema_node) do
      {
        "@id": "http://schema.org/recipeCuisine",
        "@type": "rdf:Property",
        "http://schema.org/domainIncludes": {
          "@id": "http://schema.org/Recipe"
        },
        "http://schema.org/rangeIncludes": {
          "@id": "http://schema.org/Text"
        },
        "rdfs:comment": "The cuisine of the recipe (for example, French or Ethiopian).",
        "rdfs:label": "recipeCuisine"
      }
    end

    it "reads the label correctly" do
      expect(subject.read!("label")).to eq("recipeCuisine")
    end
  end

  describe "#read_as_language_map" do
    let(:node) { { "rdfs:comment": comment } }
    let(:parsed_comment) { described_class.new(node).read_as_language_map("comment") }

    context "nothing" do
      let(:comment) { nil }

      it "returns an empty array" do
        expect(parsed_comment).to eq([])
      end
    end

    context "string" do
      let(:comment) { "Comment" }

      it "returns an array with a single element" do
        expect(parsed_comment).to eq(["Comment"])
      end
    end

    context "hash with language code keys that are not listed as lang keys" do
      let(:comment) { { "english" => "Comment", "es" => "Comentario", "jp" => "意見" } }

      it "returns an array of the hash's values" do
        expect(parsed_comment).to eq(%w(Comment Comentario 意見))
      end
    end

    context "hash with @value" do
      let(:comment) { { "@language" => "ko", "@value" => "논평" } }

      it "returns an array with the @value property" do
        expect(parsed_comment).to eq(["논평"])
      end
    end

    context "array of mixed content" do
      let(:comment) do
        [
          "Комментарий",
          { "@language" => "kk", "@value" => "Түсініктеме" }
        ]
      end

      it "returns an array with the @value property" do
        expect(parsed_comment).to eq(%w(Комментарий Түсініктеме))
      end
    end
  end

  describe "#rdfs_class_nodes" do
    subject { described_class.new(node, classes:).rdfs_class_nodes }
    let(:classes) { [] }

    context "when it's explicitly an rdfs:Class" do
      let(:node) do
        {
          "@type": "rdfs:Class",
          "@id": "ceterms:RuleSet",
          "rdfs:label": {
            "en-US": "Rule Set"
          },
          "rdfs:comment": {
            "en-US": "Resource that identifies the rules or methods by which one or more..."
          },
          "dct:description": {
            "en-US": "In the future, there will likely be multiple formally recognized RuleSets."
          },
          "vann:usageNote": {
            "en-US": "Encode the rules using Description Logic."
          },
          "vs:term_status": "vs:unstable",
          "meta:changeHistory": "http://credreg.net/ctdl/termhistory/ceterms/RuleSet/json"
        }
      end

      it "returns the same node" do
        expect(subject).to eq([])
      end
    end

    context "with inference" do
      let(:node) do
        {
          "@id": "http://schema.org/EventCancelled",
          "@type": "http://schema.org/EventStatusType",
          "rdfs:comment": "The event has been cancelled. If the event has multiple startDate values, all are ...",
          "rdfs:label": "EventCancelled"
        }
      end

      it "infers the node type" do
        expect(subject).to eq([])
      end
    end

    context "with domain" do
      let(:node) do
        { "@id" => ":P600539", "@type" => "rdf:Property", "dc:creator" => "Common Education Data Standards",
          "rdfs:label" => "Has Person Credential", "dc:identifier" => { "@type" => "xsd:token", "@value" => "P600539" },
          "skos:notation" => "hasPersonCredential", "schema:rangeIncludes" => { "@id" => ":C200280" },
          "schema:domainIncludes" => { "@id" => "C200275:testLabel" } }
      end

      context "without classes" do
        it "returns id with label from domain id" do
          expect(subject).to eq([{
                                  "@id" => "C200275:testLabel",
                                  "rdfs:label" => "Test Label"
                                }])
        end
      end

      context "with classes" do
        let(:classes) do
          [
            Parsers::JsonLd::Node.new({ "@id" => "C200275:testLabel", "rdfs:label" => "Class Label" })
          ]
        end

        it "returns id with label from domain label" do
          expect(subject).to eq([{
                                  "@id" => "C200275:testLabel",
                                  "rdfs:label" => "Class Label"
                                }])
        end
      end
    end
  end
end
