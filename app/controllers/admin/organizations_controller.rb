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
  # @description: Lists all the organizations
  ###
  def index
    @organizations = Organization.all
  end

  ###
  # @description: Removes an organization from the database
  ###
  def destroy
    @organization.destroy!
    flash[:info] = t("alerts.successfully_deleted", record: Organization.name)
    redirect_to admin_organizations_path
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
    @organization = @organization || params[:id].present? ? Organization.find(params[:id]) : Organization.first
  end
end
