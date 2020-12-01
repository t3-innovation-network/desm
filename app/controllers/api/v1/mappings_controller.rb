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

    render json: mappings, include: [:terms, :selected_terms, {specification: {include: %i[user terms]}}]
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
  # @description: Removes a mapping from the database
  ###
  def destroy
    @instance.destroy!

    render json: {
      success: true
    }
  end

  ###
  # @description: Udates the attributes of a mapping
  ###
  def update
    @instance.update!(permitted_params)

    render json: @instance
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
    mappings = mappings.where(user: current_user) if params[:filter] != "all"

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
