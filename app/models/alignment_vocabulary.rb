# frozen_string_literal: true

###
# @description: Represents a mapping between 2 vocabularies
# - Each vocabulary mapping have 1 to many concepts. --- [vocabulary mapping] 1------>* [vocabulary concept],
# - Each of these concepts, have one spine property, --- [vocabulary concept] 1------>1 [spine property]
# - and many mapping properties.                     --- [vocabulary concept] 1------>* [mapping property]
#
# This last in order to represent the multiple alignment between concepts
###
class AlignmentVocabulary < ApplicationRecord
  belongs_to :mapping_term
  has_many :concepts, class_name: :AlignmentVocabularyConcept, dependent: :destroy

  after_create :assign_concepts_from_spine, unless: proc { concepts.count.positive? }

  ###
  # @description: If this vocabulary mapping was created from the controller, it does not contain any concept yet.
  #   Let's create each one from the spine property vocabulary concepts.
  # @return [TrueClass|FalseClass]
  ###
  def assign_concepts_from_spine
    # The first of the vocabularies is what we need. The client
    spine_vocabulary = mapping_term.spine_term.vocabularies.first

    return unless spine_vocabulary.present?

    spine_vocabulary.concepts.each do |concept|
      AlignmentVocabularyConcept.create!(
        alignment_vocabulary: self,
        spine_concept_id: concept.id
      )
    end
  end
end
