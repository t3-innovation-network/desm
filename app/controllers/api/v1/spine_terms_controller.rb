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
      assign_term_to_spine(spine_term, permitted_params[:specification_id])
      @alignment = MappingTerm.create!(permitted_params[:mapping_term].merge(spine_term_id: spine_term.id))
    end

    render json: @alignment
  end

  private

  ###
  # @description: Since a term can be part of many specifications and a specification
  #   can have many terms, we need to set that relation explicitly
  # @param [Object] term
  # @param [Integer] specification_id
  ###
  def assign_term_to_spine term, specification_id
    specification = Specification.find(specification_id)
    specification.terms << term
  end

  ###
  # @description: Clean params
  # @return [ActionController::Parameters]
  ###
  def permitted_params
    params.require(:synthetic).permit(
      :specification_id,
      spine_term: [
        :name, :uri, :organization_id,
        property_attributes: %i[
          uri label comment
        ]
      ],
      mapping_term: %i[
        comment predicate_id mapping_id uri synthetic
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
