# frozen_string_literal: true

###
# @description: Place all the actions related to vocabulariy mappings
###
class Api::V1::AlignmentSyntheticConceptsController < ApplicationController
  before_action :validate_mapped_concepts, only: [:create]
  after_action :set_mapped_concepts, only: [:create]

  ###
  # @description: Creates a new (synthetic) concept for the vocabulary, along with its alignment
  ###
  def create
    ActiveRecord::Base.transaction do
      spine_concept = SkosConcept.create!(permitted_params[:spine_concept])
      @alignment = AlignmentVocabularyConcept.create!(
        permitted_params[:alignment].merge(spine_concept_id: spine_concept.id)
      )

      @alignment.alignment_vocabulary.spine_vocabulary.concepts << spine_concept
    end

    render json: @alignment
  end

  private

  ###
  # @description: Ensure we have the mapped concepts in order to add the new synthetic concept to the spine vocabulary
  ###
  def validate_mapped_concepts
    return if params[:synthetic][:alignment][:mapped_concepts].present?

    raise "No mapped concepts provided for the new synthetic concept"
  end

  ###
  # @description: Set the mapped concepts to the recently created alignment
  ###
  def set_mapped_concepts
    @alignment.update_mapped_concepts(params[:synthetic][:alignment][:mapped_concepts])
  end

  ###
  # @description: Clean params
  # @return [ActionController::Parameters]
  ###
  def permitted_params
    params.require(:synthetic).permit(
      spine_concept: [
        :uri, {raw: {}}
      ],
      alignment: %i[
        predicate_id alignment_vocabulary_id
      ]
    )
  end
end
