# frozen_string_literal: true

###
# @description: Place all the actions related to spine terms
###
class API::V1::SpineTermsController < ApplicationController
  before_action :validate_mapped_terms, only: [:create]
  after_action :set_mapped_terms, only: [:create]

  def index
    terms = Spine.find(params[:id]).terms

    render json: terms, include: %i[organization property vocabularies]
  end

  ###
  # @description: Creates a new (synthetic) term for the spine, along with its alignment
  ###
  def create
    result = CreateSyntheticTerm.call(params: permitted_params)
    @alignment = result.alignment
    render json: @alignment
  end

  private

  ###
  # @description: Clean params
  # @return [ActionController::Parameters]
  ###
  def permitted_params
    params.require(:synthetic).permit(
      :spine_id,
      :spine_term_id,
      alignment: %i[
        comment predicate_id mapping_id uri synthetic
      ]
    )
  end

  ###
  # @description: Ensure we have the mapped terms in order to add the new synthetic term to the spine
  ###
  def validate_mapped_terms
    raise "No mapped terms provided for synthetic" unless params[:synthetic][:alignment][:mapped_terms].present?
  end

  ###
  # @description: Set the mapped terms to the recently created alignment
  ###
  def set_mapped_terms
    @alignment.update_mapped_terms(params[:synthetic][:alignment][:mapped_terms])
  end
end
