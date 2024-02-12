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

  describe "rdfs_class_nodes returns the same node when it's explicitly an rdfs:Class" do
    subject { described_class.new(credential_registry_node) }

    let(:credential_registry_node) do
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
      expect(subject.rdfs_class_nodes).to eq([])
    end
  end

  describe "rdfs_class_nodes with inference" do
    subject { described_class.new(node_to_infer) }

    let(:node_to_infer) do
      {
        "@id": "http://schema.org/EventCancelled",
        "@type": "http://schema.org/EventStatusType",
        "rdfs:comment": "The event has been cancelled. If the event has multiple startDate values, all are assumed ...",
        "rdfs:label": "EventCancelled"
      }
    end

    it "infers the node type" do
      expect(subject.rdfs_class_nodes).to eq([])
    end
  end
end
