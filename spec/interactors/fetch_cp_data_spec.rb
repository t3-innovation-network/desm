# frozen_string_literal: true

require "rails_helper"

describe FetchCpData, type: :interactor do
  describe ".call" do
    context "with invalid input" do
      let(:configuration_profile) { create(:configuration_profile) }

      it "rejects creation if configuration_profile is not passed" do
        result = described_class.call
        expect(result.error).to eq("configuration_profile must be present")
      end

      it "rejects creation if skos_method is not passed" do
        result = described_class.call(configuration_profile:)
        expect(result.error).to eq("skos_method must be present")
      end

      it "rejects creation if skos_method is not one of the allowed ones" do
        result = described_class.call({ configuration_profile:, skos_method: "not_allowed" })
        expect(result.error).to eq("skos method should be one of: json_mapping_predicates, json_abstract_classes")
      end
    end

    context "with valid input" do
      let(:configuration_profile) { create(:configuration_profile) }
      subject { described_class.call({ configuration_profile:, skos_method: }) }

      context "with predicates" do
        let(:configuration_profile) { create(:configuration_profile, :with_mapping_predicates) }
        let(:skos_method) { "json_mapping_predicates" }

        it "returns data from predicate set" do
          expect(subject.success?).to be_truthy
          expect(subject.concept_names.size).to eq 1
          expect(subject.concept_names.first[:label]).to eq configuration_profile.predicates.first.pref_label
        end
      end

      context "without predicates" do
        let(:configuration_profile) { create(:configuration_profile) }
        let(:skos_method) { "json_mapping_predicates" }

        it "returns data from json" do
          expect(subject.success?).to be_truthy
          expect(subject.concept_names.size).to eq 9
        end
      end

      context "with abstract classes" do
        let(:configuration_profile) { create(:configuration_profile, :with_abstract_classes) }
        let(:skos_method) { "json_abstract_classes" }

        it "returns data from domain set" do
          expect(subject.success?).to be_truthy
          expect(subject.concept_names.size).to eq 1
          expect(subject.concept_names.first[:label]).to eq configuration_profile.domains.first.pref_label
        end
      end

      context "without abstract classes" do
        let(:configuration_profile) { create(:configuration_profile) }
        let(:skos_method) { "json_abstract_classes" }

        it "returns data from json" do
          expect(subject.success?).to be_truthy
          expect(subject.concept_names.size).to eq 8
        end
      end
    end
  end
end
