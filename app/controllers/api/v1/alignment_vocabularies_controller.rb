# frozen_string_literal: true

###
# @description: Place all the actions related to vocabulariy mappings
###
class Api::V1::AlignmentVocabulariesController < ApplicationController
  ###
  # @description: Returns the vocabulary mapping for a specific alignment,
  #   with its concepts
  ###
  def show
    mapping_term = MappingTerm.find(params[:id])

    @vocabulary = mapping_term.vocabulary ||= AlignmentVocabulary.create!(
      mapping_term_id: mapping_term.id,
      title: "Vocabulary for #{mapping_term.uri}"
    )

    render json: @vocabulary, include: {concepts: {include: :mapped_concepts}}
  end
end
