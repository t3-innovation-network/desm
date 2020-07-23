# frozen_string_literal: true

###
# @description: Place all the actions related to organizations
###
class Admin::OrganizationsController < ApplicationController
  # We use a different template for this controller, in order the make a
  # difference between the public and the restricted html templates
  layout "admin"
  before_action :authorize_with_policy

  include Pundit

  ###
  # @description: List all the organizations
  ###
  def index
    @organizations = Organization.all
  end

  private

  ###
  # @description: Execute the authorization policy
  ###
  def authorize_with_policy
    authorize organization
  end

  ###
  # @description: Get the current model record
  # @return [ActiveRecord]
  ###
  def organization
    @organization || params[:id].present? ? Organization.find(params[:id]) : Organization.first
  end
end
