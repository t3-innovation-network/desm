# frozen_string_literal: true

###
# @description: Place all the actions related to specifications
###
class Api::V1::SpecificationsController < ApplicationController
  before_action :with_instance

  ###
  # @description: Create a specification with its terms. Store it from an already
  #   filtered JSON object
  ###
  def create
    # Process the file
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
    @instance.destroy!

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
    # We assume we received one only file with all the data
    unified_spec_data = params[:specification][:content]

    permitted_params.merge(
      user: current_user,
      domain_id: params[:specification][:domain_id],
      spec: unified_spec_data
    )
  end

  ###
  # @description: Clean params
  # @return [ActionController::Parameters]
  ###
  def permitted_params
    params.require(:specification).permit(:name, :version, :uri, :use_case, :scheme)
  end
end
