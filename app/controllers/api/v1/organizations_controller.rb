# frozen_string_literal: true

###
# @description: Place all the actions related to organizations
###
class Api::V1::OrganizationsController < ApplicationController
  before_action :authorize_with_policy

  ###
  # @description: Lists all the organizations
  ###
  def index
    organizations = Organization.all.order(name: :asc)

    render json: organizations, include: :users
  end

  ###
  # @description: Prepares the data for the edit form
  ###
  def show
    render json: @instance
  end

  ###
  # @description: Adds a new organization to the database
  ###
  def create
    @instance = Organization.create(permitted_params)

    render json: {
      success: true,
      organization: @instance
    }
  end

  ###
  # @description: Udates the attributes of an organization
  ###
  def update
    @instance.update(permitted_params)
    render json: @instance
  end

  ###
  # @description: Removes an organization from the database
  ###
  def destroy
    @instance.destroy!

    render json: {
      status: :removed
    }
  end

  private

  ###
  # @description: Execute the authorization policy
  ###
  def authorize_with_policy
    authorize(with_instance)
  end

  ###
  # @description: Clean params
  # @return [ActionController::Parameters]
  ###
  def permitted_params
    params.require(:organization).permit(:name)
  end
end
