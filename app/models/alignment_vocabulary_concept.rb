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

###
# @description: Represents a concept of a mapping between 2 vocabularies
# - Each vocabulary mapping have 1 to many concepts.
# - Each of these concepts, have one [spine property] -> [vocabulary concept],
# - and many [mapping property] -> [vocabulary concepts].
#
# This last in order to represent the multiple alignment between concepts
###
class AlignmentVocabularyConcept < ApplicationRecord
  ###
  # @description: The vocabulary for the alignment between two properties
  ###
  belongs_to :alignment_vocabulary

  belongs_to :predicate, optional: true

  belongs_to :spine_concept, class_name: "SkosConcept"

  ###
  # @description: The mapping property concepts this new concept is aligning
  ###
  has_and_belongs_to_many :mapped_concepts,
                          join_table: :alignment_vocabulary_concept_mapped_concepts,
                          class_name: "SkosConcept"

  ###
  # @description: Associate the concepts to this alignment vocabulary. NOTE: This method will replace the previous
  #   associated concepts, so if you need to add concepts, maintaining the previous ones, include the
  #   previous ids in the params.
  #
  # @param [Array] mapped_term_ids: A collection of ids representing the concepts that are
  #   going to be mapped to this alignment
  ###
  def update_mapped_concepts(ids)
    self.mapped_concept_ids = ids
  end

  ###
  # @description: A simplified list of concepts to list as standard json
  # @return [Array]
  ###
  def mapped_concepts_list
    Parsers::Skos.new(
      graph: mapped_concepts.map do |concept|
        concept.raw.merge(key: concept.id)
      end
    )
      .concepts_list_simplified
  end

  ###
  # @description: Include additional information about the specification in
  #   json responses. This overrides the ApplicationRecord as_json method.
  ###
  def as_json(options = {})
    super(options.merge(methods: %i(mapped_concepts_list)))
  end
end
