# frozen_string_literal: true

# == Schema Information
#
# Table name: alignment_vocabularies
#
#  id           :bigint           not null, primary key
#  creator      :string
#  description  :string
#  title        :string
#  alignment_id :bigint           not null
#
# Indexes
#
#  index_alignment_vocabularies_on_alignment_id  (alignment_id)
#
# Foreign Keys
#
#  fk_rails_...  (alignment_id => alignments.id) ON DELETE => cascade
#

###
# @description: Represents a mapping between 2 vocabularies
# - Each vocabulary mapping have 1 to many concepts. --- [vocabulary mapping] 1------>* [vocabulary concept],
# - Each of these concepts, have one spine property, --- [vocabulary concept] 1------>1 [spine property]
# - and many mapping properties.                     --- [vocabulary concept] 1------>* [mapping property]
#
# This last in order to represent the multiple alignment between concepts
###
class AlignmentVocabulary < ApplicationRecord
  belongs_to :alignment
  has_one :mapping, through: :alignment
  has_one :spine_term, through: :alignment
  has_many :concepts, class_name: :AlignmentVocabularyConcept, dependent: :destroy

  after_create :assign_concepts_from_spine, unless: proc { concepts.count.positive? }

  ###
  # @description: The first of the vocabularies is what we need. The client
  # @return [Vocabulary]
  ###
  def spine_vocabulary
    return unless spine_term

    spine_term.vocabularies.first
  end

  ###
  # @description: If this vocabulary mapping was created from the controller, it does not contain any concept yet.
  #   Let's create each one from the spine property vocabulary concepts.
  # @return [Array]
  ###
  def assign_concepts_from_spine
    spine = alignment.spine.mappings.count == 1

    spine_vocabulary.concepts.each do |concept|
      concepts.create!(
        mapped_concepts: spine ? [concept] : [],
        predicate_id: (mapping.mapping_predicates.strongest_match_id if spine),
        spine_concept_id: concept.id
      )
    end
  end
end
