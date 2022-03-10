# frozen_string_literal: true

###
# @description: Place all the actions related to mappings
###
class Api::V1::MappingSelectedTermsController < ApplicationController
  before_action :validate_mapping_terms, only: [:create]
  before_action :instantiate

  ###
  # @description: Creates the selected mapping terms. This method is used when the user has already
  #   decided which terms to map to the spine
  ###
  def create
    # Proceed to create the mapping terms
    @instance.update_selected_terms(params[:term_ids])

    render json: @instance, include: %i[terms selected_terms]
  end

  ###
  # @description: Fetch the mapping terms for the mapping with the id equal
  #   to the one passed in params
  ###
  def show
    render json: @instance.selected_terms.order(:source_uri), include: [:property]
  end

  ###
  # @description: Removes a term from the selected terms of a mapping
  ###
  def destroy
    term = Term.find(params[:term_id])

    @instance.selected_terms.delete(term)

    render json: @instance, include: :selected_terms
  end

  private

  ###
  # @description: Get the instance of the mapping to work with
  ###
  def instantiate
    with_instance(Mapping)
  end

  ###
  # @description: Validates that mapping terms are passed in params
  ###
  def validate_mapping_terms
    raise "Mapping terms were not provided" unless params[:term_ids].present? && params[:term_ids].length.positive?
  end
end
