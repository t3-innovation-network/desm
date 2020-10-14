# frozen_string_literal: true

###
# @description: Place all the actions related to mappings
###
class Api::V1::MappingTermsController < ApplicationController
  before_action :authorize_with_policy

  ###
  # @description: Updates a single mapping term, firstly updating its mapped terms
  ###
  def update
    ActiveRecord::Base.transaction do
      if params[:mapping_term][:mapped_terms].present?
        @mapping_term.update_mapped_terms(params[:mapping_term][:mapped_terms])
      end
      @mapping_term.update!(permitted_params)
    end

    render json: @mapping_term, include: %i[mapped_terms]
  end

  private

  ###
  # @description: Execute the authorization policy
  ###
  def authorize_with_policy
    authorize mapping_term
  end

  ###
  # @description: Get the current model record
  # @return [MappingTerm]
  ###
  def mapping_term
    @mapping_term = MappingTerm.find(params[:id])
  end

  ###
  # @description: Clean params
  # @return [ActionController::Parameters]
  ###
  def permitted_params
    params.require(:mapping_term).permit(:comment, :predicate_id)
  end
end
