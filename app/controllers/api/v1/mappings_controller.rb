# frozen_string_literal: true

###
# @description: Place all the actions related to mappings
###
class Api::V1::MappingsController < ApplicationController
  before_action :authorize_with_policy

  ###
  # @description: Lists all the mappings for the current user's organization
  ###
  def index
    mappings = filter

    render json: mappings, include: [:terms, {specification: {include: %i[user terms]}}]
  end

  ###
  # @description: Creates a mapping with its related specification
  ###
  def create
    spec = Specification.find(params[:specification_id])

    # Proceed to create the mapping if this is not the spine
    mapping = Processors::Mappings.create(spec, current_user) unless spec.spine?

    render json: mapping, include: :specification
  end

  ###
  # @description: Udates the attributes of a mapping
  ###
  def update
    @instance.update!(permitted_params)

    render json: @instance
  end

  ###
  # @description: Creates the selected mapping terms. This method is used when the user has already
  #   decided which terms to map to the spine
  ###
  def create_selected_terms
    # Validate mapping existence (We will create mapping terms for an existent mapping)
    mapping = Mapping.find(params[:mapping_id])
    terms = params[:terms]

    raise "Mapping terms were not provided" unless terms.present? && terms.any?

    # Proceed to create the mapping terms
    Processors::Mappings.create_selected_terms(mapping, terms)

    render json: mapping, include: :terms
  end

  ###
  # @description: Fetch the mapping with the id equal to the one passed
  #   in params
  ###
  def show
    render json: @instance, include: %i[terms selected_terms]
  end

  ###
  # @description: Fetch the mapping terms for the mapping with the id equal
  #   to the one passed in params
  ###
  def show_terms
    render json: @instance.terms.order(:uri), include: {mapped_terms: {include: %i[property vocabularies]}}
  end

  ###
  # @description: Fetch the mapping terms for the mapping with the id equal
  #   to the one passed in params
  ###
  def show_selected_terms
    render json: @instance.selected_terms.order(:uri), include: [:property]
  end

  private

  ###
  # @description: Execute the authorization policy
  ###
  def authorize_with_policy
    authorize(with_instance)
  end

  ###
  # @description: Applies the filter/s from the params
  # @return [ActiveRecord::Relation]
  ###
  def filter
    # Always show only the mappings for the current user's organization
    mappings = Mapping.where(user: current_user.organization.users)

    # Filter by current user
    mappings = mappings.where(user: current_user) if params[:filter].present? && params[:filter] != "all"

    # Return an ordered list
    mappings.order(:title)
  end

  ###
  # @description: Clean params
  # @return [ActionController::Parameters]
  ###
  def permitted_params
    params.require(:mapping).permit(:status)
  end
end
