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

  after_create :assign_concepts_from_spine, unless: -> { concepts.exists? }

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
  #   Let's create each one from the spine property vocabulary concepts and as there were no alignments yet, we
  #   map them 1 to 1 with the strongest predicate.
  # @return [Array]
  ###
  def assign_concepts_from_spine
    spine_term_concepts = spine_term.vocabularies.flat_map(&:concepts)

    spine_term_concepts.each do |concept|
      concepts.create!(
        mapped_concepts: [concept],
        predicate_id: mapping.mapping_predicates.strongest_match_id,
        spine_concept_id: concept.id
      )
    end
  end
end
