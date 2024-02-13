# frozen_string_literal: true

# == Schema Information
#
# Table name: alignment_vocabulary_concepts
#
#  id                      :bigint           not null, primary key
#  alignment_vocabulary_id :bigint           not null
#  predicate_id            :bigint
#  spine_concept_id        :integer          not null
#
# Indexes
#
#  index_alignment_vocabulary_concepts_on_alignment_vocabulary_id  (alignment_vocabulary_id)
#  index_alignment_vocabulary_concepts_on_predicate_id             (predicate_id)
#
# Foreign Keys
#
#  fk_rails_...  (alignment_vocabulary_id => alignment_vocabularies.id) ON DELETE => cascade
#  fk_rails_...  (predicate_id => predicates.id)
#
FactoryBot.define do
  factory :alignment_vocabulary_concept do
    alignment_vocabulary
    spine_concept { create(:skos_concept) }
  end
end
