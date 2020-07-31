# frozen_string_literal: true

###
# @description: Place all the actions related to organizations
###
class Api::V1::OrganizationsController < ApplicationController
  before_action :set_organization

  ###
  # @description: Lists all the organizations
  ###
  def index
    @organizations = Organization.all.order(name: :asc)

    if @organizations
      render json: {
        success: true,
        organizations: @organizations
      }
    else
      render json: {status: 500}, status: :internal_server_error
    end
  end

  ###
  # @description: Prepares the data for the edit form
  ###
  def show
    if @organization
      render json: {
        success: true,
        organization: @organization
      }
    else
      render json: {status: 500}, status: :internal_server_error
    end
  end

  ###
  # @description: Adds a new organization to the database
  ###
  def create
    @organization = Organization.create(permitted_params)

    if @organization
      render json: {
        success: true,
        organization: @organization
      }
    else
      render json: {status: 500}, status: :internal_server_error
    end
  end

  ###
  # @description: Udates the attributes of an organization
  ###
  def update
    if @organization.update(permitted_params)
      render json: {
        success: true,
        organization: @organization
      }
    else
      render json: {status: 500}, status: :internal_server_error
    end
  end

  ###
  # @description: Removes an organization from the database
  ###
  def destroy
    if @organization.destroy!
      render json: {
        status: :removed
      }
    else
      render json: {status: 500}, status: :internal_server_error
    end
  end

  private

  ###
  # @description: Execute the authorization policy
  ###
  def set_organization
    organization
  end

  ###
  # @description: Get the current model record
  # @return [ActiveRecord]
  ###
  def organization
    @organization = @organization || params[:id].present? ? Organization.find(params[:id]) : Organization.first
  end

  ###
  # @description: Clean params
  # @return [ActionController::Parameters]
  ###
  def permitted_params
    params.require(:organization).permit(:name)
  end
end
