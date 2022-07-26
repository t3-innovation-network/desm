# frozen_string_literal: true

###
# @description: Place all the actions related to mappings
###
class Api::V1::MappingsController < ApplicationController
  before_action :authorize_with_policy
  before_action :instantiate_specification, only: :create

  ###
  # @description: Creates a mapping with its related specification
  ###
  def create
    @instance = Processors::Mappings.new(@specification, current_user).create

    render json: @instance, include: :specification
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
  # @description: Returns a JSON string to let the user download it as the
  #   mapping JSON-LD version.
  ###
  def export
    render json: @instance.export
  end

  ###
  # @description: Lists all the mappings for the current user's organization
  ###
  def index
    mappings =
      if params[:filter] == "all"
        current_configuration_profile.mappings || Mapping.none
      else
        current_user.mappings
      end

    render json: mappings.order(:title),
           include: [:terms, :selected_terms, {specification: {include: %i[user terms]}}]
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
  # @description: Updates the attributes of a mapping
  ###
  def update
    @instance.update!(permitted_params)

    render json: @instance
  end

  private

  ###
  # @description: Execute the authorization policy
  ###
  def authorize_with_policy
    authorize(with_instance)
  end

  ###
  # @description: Find the specification with the id passed in params
  ###
  def instantiate_specification
    raise "Specification id not provided" unless params[:specification_id].present?

    @specification = Specification.find(params[:specification_id])
  end

  ###
  # @description: Clean params
  # @return [ActionController::Parameters]
  ###
  def permitted_params
    params.require(:mapping).permit(:status)
  end
end
