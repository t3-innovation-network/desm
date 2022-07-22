# frozen_string_literal: true

###
# @description: Place all the actions related to specifications
###
class Api::V1::SpecificationsController < ApplicationController
  ###
  # @description: Create a specification with its terms. Store it from an already
  #   filtered JSON object
  ###
  def create
    spec = Processors::Specifications.create(valid_params)

    render json: spec
  end

  ###
  # @description: Returns the specification with id equal to the one passed in params
  ###
  def show
    @specification = Specification.find(params[:id])

    render json: @specification, include: %i[user domain]
  end

  ###
  # @description: Delete the given specification from the database
  ###
  def destroy
    spine = current_user.organization.spines.find(params[:id])
    spine.destroy

    render json: {
      success: true
    }
  end

  private

  ###
  # @description: Clean the parameters with all needed for specifications creation
  # @return [ActionController::Parameters]
  ###
  def valid_params
    permitted_params.merge(
      domain_id: params[:specification][:domain_id],
      user: current_user,
      # We assume we received one only file with all the data
      spec: params[:specification][:content],
      selected_domains: params[:specification][:selected_domains]
    )
  end

  ###
  # @description: Clean params
  # @return [ActionController::Parameters]
  ###
  def permitted_params
    params.require(:specification).permit(:name, :scheme, :use_case, :uri, :version)
  end
end
