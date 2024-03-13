# frozen_string_literal: true

require "rails_helper"

describe UpdateMappingPredicates, type: :interactor do
  describe ".call" do
    let(:json_body) { json_fixture("desmMappingPredicates.json") }

    context "with invalid input" do
      it "rejects creation if json body is not passed" do
        result = described_class.call

        expect(result.error).to eq("json body must be present")
      end

      it "rejects creation if predicate set is not passed" do
        result = described_class.call({ json_body: })
        expect(result.error).to eq("predicate_set must be present")
      end
    end

    context "with valid input" do
      let(:predicate_set) { create(:predicate_set) }
      let(:identical_source_uri) { "http://desmsolutions.org/concepts/identical" }
      let!(:predicate1) { create(:predicate, source_uri: identical_source_uri, predicate_set:) }
      let!(:predicate2) { create(:predicate, source_uri: "persisted", predicate_set:) }
      let(:subject) { described_class.call({ json_body:, predicate_set: }) }

      context "with valid json body" do
        let!(:alignment) { create(:alignment, predicate: predicate3) }
        let(:json_body) { json_fixture("desmMappingPredicates_v1.json") }

        context "when no conflicts in current/new sheme" do
          let(:predicate3) { create(:predicate, source_uri: "keep") }

          it "updates the predicate set and merge/update with existing predicates, removing unused predicates" do
            expect { subject }.to change { Predicate.count }.from(3).to(11)
            expect(subject.success?).to be_truthy
            expect(subject.predicate_set.description).to include "TEST"
            expect(subject.predicate_set.title).to include "TEST"
            expect(subject.predicate_set.source_uri).to eq "http://desmsolutions.org/concepts/desmMappingPredicates"
            identical = subject.predicate_set.predicates.find { |p| p.source_uri == identical_source_uri }
            expect(identical.pref_label).to eq "Identical"
            expect(identical.definition).to include "UPDATED"
          end
        end

        context "when there are conflicts in current/new sheme" do
          let(:predicate3) { create(:predicate, source_uri: "keep", predicate_set:) }

          it "doesn't apply changes and returns error" do
            expect { subject }.not_to change { Predicate.count }
            expect(subject.success?).not_to be_truthy
            expect(subject.error).to include predicate3.source_uri
            expect(subject.predicate_set.description).not_to include "TEST"
            expect(subject.predicate_set.source_uri).not_to eq "http://desmsolutions.org/concepts/desmMappingPredicates"
          end
        end
      end

      context "with invalid json body" do
        let(:json_body) { "invalid.json" }

        it "returns an error" do
          expect { subject }.not_to change { Predicate.count }
          expect(subject.success?).not_to be_truthy
          expect(subject.error).to include "unexpected token"
        end
      end
    end
  end
end
