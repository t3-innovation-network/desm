# frozen_string_literal: true

# == Schema Information
#
# Table name: alignments
#
#  id             :bigint           not null, primary key
#  comment        :text
#  synthetic      :boolean          default(FALSE), not null
#  transformation :jsonb
#  uri            :string
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  mapping_id     :bigint           not null
#  predicate_id   :bigint
#  spine_term_id  :integer
#  vocabulary_id  :bigint
#
# Indexes
#
#  index_alignments_on_mapping_id     (mapping_id)
#  index_alignments_on_predicate_id   (predicate_id)
#  index_alignments_on_vocabulary_id  (vocabulary_id)
#
# Foreign Keys
#
#  fk_rails_...  (mapping_id => mappings.id) ON DELETE => cascade
#  fk_rails_...  (predicate_id => predicates.id)
#  fk_rails_...  (spine_term_id => terms.id) ON DELETE => cascade
#  fk_rails_...  (vocabulary_id => vocabularies.id)
#

require "rails_helper"

describe Alignment do
  it { is_expected.to validate_presence_of(:uri) }

  describe "associations" do
    specify(:aggregate_failures) do
      is_expected.to belong_to(:mapping)
      is_expected.to belong_to(:predicate).optional
      is_expected.to belong_to(:spine_term).optional
      is_expected.to have_and_belong_to_many(:mapped_terms).class_name("Term").join_table(:alignment_mapped_terms)
      is_expected.to have_one(:spine).through(:mapping)
      is_expected.to have_one(:vocabulary).class_name("AlignmentVocabulary")
      is_expected.to have_many(:alignment_vocabularies)
    end
  end

  describe "callbacks" do
    it "calls notify_mapping_updated after update if mapping is mapped" do
      mapping = create(:mapping, :mapped)
      alignment = create(:alignment, mapping:)

      expect(alignment).to receive(:notify_mapping_updated)
      alignment.save!
    end

    it "clears mapped_terms before destroy" do
      alignment = create(:alignment)
      term = create(:term)
      alignment.mapped_terms << term

      alignment.destroy

      expect(alignment.mapped_terms).to be_empty
    end

    it "calls remove_spine_term before destroy if synthetic is true" do
      alignment = create(:alignment, synthetic: true)
      mapping = create(:mapping)
      spine = create(:spine)
      term = create(:term)
      mapping.spine = spine
      alignment.mapping = mapping
      alignment.spine_term = term

      expect(alignment).to receive(:remove_spine_term)
      alignment.destroy
    end
  end

  describe "#completed?" do
    it "returns if alignment is completed" do
      term = create(:term)
      predicate = create(:predicate)
      predicate2 = create(:predicate, :nomatch)
      alignment1 = create(:alignment, spine_term: term, mapped_terms: [term], predicate:)
      alignment2 = create(:alignment, predicate:, spine_term: term)
      alignment3 = create(:alignment, predicate:, spine_term: term, synthetic: true)
      alignment4 = create(:alignment, predicate:, spine_term: term, synthetic: false)
      alignment5 = create(:alignment, predicate: predicate2, spine_term: term, synthetic: true)

      completed_alignments = term.alignments.select(&:completed?)

      expect(completed_alignments).to include(alignment1)
      expect(completed_alignments).to include(alignment5)
      expect(completed_alignments).not_to include(alignment2)
      expect(completed_alignments).not_to include(alignment3)
      expect(completed_alignments).not_to include(alignment4)
    end
  end

  describe "#mapped?" do
    it "returns if alignment is mapped" do
      term = create(:term)
      predicate = create(:predicate)
      predicate2 = create(:predicate, :nomatch)
      alignment1 = create(:alignment, spine_term: term, mapped_terms: [term], predicate:)
      alignment2 = create(:alignment, predicate:, spine_term: term)
      alignment3 = create(:alignment, predicate:, spine_term: term, synthetic: true)
      alignment4 = create(:alignment, predicate:, spine_term: term, synthetic: false)
      alignment5 = create(:alignment, predicate: predicate2, spine_term: term, synthetic: true)

      mapped_alignments = term.alignments.select(&:mapped?)

      expect(mapped_alignments).to include(alignment1)
      expect(mapped_alignments).not_to include(alignment5)
      expect(mapped_alignments).not_to include(alignment2)
      expect(mapped_alignments).not_to include(alignment3)
      expect(mapped_alignments).not_to include(alignment4)
    end
  end

  describe "methods" do
    xit "calls notify_updated on mapping when notify_mapping_updated is called" do
      mapping = create(:mapping)
      alignment = create(:alignment, mapping:)

      expect(mapping).to receive(:notify_updated)
      alignment.send(:notify_mapping_updated)
    end

    it "returns the origin of the mapping" do
      mapping = create(:mapping)
      alignment = create(:alignment, mapping:)

      origin = alignment.origin

      expect(origin).to eq(mapping.origin)
    end

    it "removes the related spine term" do
      spine = create(:spine)
      mapping = create(:mapping, spine:)
      term = create(:term)
      alignment = create(:alignment, mapping:, spine_term: term)

      alignment.send(:remove_spine_term)

      expect(spine.terms).not_to include(term)
    end

    it "updates the mapped terms" do
      alignment = create(:alignment)
      term1 = create(:term)
      term2 = create(:term)
      term3 = create(:term)

      alignment.update_mapped_terms([term1.id, term2.id, term3.id])

      expect(alignment.mapped_terms).to include(term1, term2, term3)
    end
  end
end
