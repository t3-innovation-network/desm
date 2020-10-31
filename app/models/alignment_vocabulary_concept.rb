# frozen_string_literal: true

###
# @description: Represents a concept of a mapping between 2 vocabularies
# - Each vocabulary mapping have 1 to many concepts.
# - Each of these concepts, have one [spine property] -> [vocabulary concept],
# - and many [mapping property] -> [vocabulary concepts].
#
# This last in order to represent the multiple alignment between concepts
###
class AlignmentVocabularyConcept < ApplicationRecord
  belongs_to :alignment_vocabulary
  # @todo: Provide class_name. Since we are not modeling the concept from vocabularies, we will need
  #   to do that first
  has_and_belongs_to_many :mapped_concepts, join_table: :alignv_mapped_concepts, dependent: :destroy
end
