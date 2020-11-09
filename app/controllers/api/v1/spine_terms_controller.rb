# frozen_string_literal: true

###
# @description: Place all the actions related to spine terms
###
class Api::V1::SpineTermsController < ApplicationController
  before_action :validate_mapped_terms, only: [:create]
  after_action :set_mapped_terms, only: [:create]

  ###
  # @description: Creates a new (synthetic) term for the spine, along with its alignment
  ###
  def create
    ActiveRecord::Base.transaction do
      spine_term = Term.create!(permitted_params[:spine_term])
      @alignment = MappingTerm.create!(permitted_params[:mapping_term].merge(spine_term_id: spine_term.id))
    end

    render json: @alignment
  end

  private

  ###
  # @description: Clean params
  # @return [ActionController::Parameters]
  ###
  def permitted_params
    params.require(:synthetic).permit(
      spine_term: [
        :name, :uri, :specification_id,
        property_attributes: %i[
          uri label comment
        ]
      ],
      mapping_term: %i[
        comment predicate_id mapping_id uri
      ]
    )
  end

  ###
  # @description: Ensure we have the mapped terms in order to add the new synthetic term to the spine
  ###
  def validate_mapped_terms
    raise "No mapped terms provided for synthetic" unless params[:synthetic][:mapping_term][:mapped_terms].present?
  end

  ###
  # @description: Set the mapped terms to the recently created alignment
  ###
  def set_mapped_terms
    @alignment.update_mapped_terms(params[:synthetic][:mapping_term][:mapped_terms])
  end
end
