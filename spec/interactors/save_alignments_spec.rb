# frozen_string_literal: true

require "rails_helper"

describe SaveAlignments, type: :interactor do
  let(:mapping) { create(:mapping) }
  let(:spine) { mapping.spine }
  let(:predicate_set) { create(:predicate_set, predicate_count: 2) }
  let(:term) { create(:term) }
  let(:params) { { id: alignment_id, mapped_term_ids: [term.id], predicate_id: } }
  subject { described_class.call(mapping:, alignments: Array.wrap(params)) }

  describe ".call" do
    context "when creating new synthetic alignment" do
      let(:alignment_id) { nil }
      let(:predicate_id) { predicate_set.predicates.first.id }
      let!(:mapping1) { create(:mapping, spine:) }

      it "creates a new synthetic alignment and adding to other mappings" do
        expect { subject }.to change { Alignment.count }.by(2)
        expect(subject.success?).to be_truthy
        expect(spine.terms).to include(term)
        expect(mapping.alignments.size).to eq(1)
        alignment = mapping.alignments.first
        expect(alignment.synthetic).to be_truthy
        expect(alignment.predicate_id).to eq(predicate_id)
        expect(alignment.mapped_terms).to match_array([term])
        expect(alignment.spine_term).to eq(term)
        expect(mapping1.alignments.size).to eq(1)
        alignment1 = mapping1.alignments.first
        expect(alignment1.synthetic).to be_falsey
        expect(alignment1.predicate_id).to be_nil
        expect(alignment1.spine_term).to eq(term)
        expect(alignment1.mapped_terms).to be_empty
      end
    end

    context "when updating alignment" do
      let!(:alignment) { create(:alignment, mapping:, predicate: predicate_set.predicates.first) }
      let(:alignment_id) { alignment.id }
      let(:predicate_id) { predicate_set.predicates.second.id }

      it "updates existing alignments" do
        expect { subject }.not_to change { Alignment.count }
        expect(subject.success?).to be_truthy
        expect(alignment.reload.predicate_id).to eq(predicate_id)
        expect(alignment.mapped_terms).to match_array([term])
      end
    end

    context "when spine term already exists" do
      let(:alignment_id) { nil }
      let(:predicate_id) { predicate_set.predicates.first.id }

      before do
        spine.terms << term
      end

      it "returns an error" do
        expect { subject }.not_to change { Alignment.count }
        expect(subject.success?).not_to be_truthy
        expect(subject.error).to include "spine"
      end
    end
  end
end
