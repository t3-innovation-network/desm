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
  # @description: Adds a new organization to the database
  ###
  def create
    @organization = Organization.create(permitted_params)

    flash[:notice] = t("alerts.successfully_added", record: Organization.name) if @organization.save

    redirect_to admin_organizations_path
  end

  def edit; end

  def update; end

  ###
  # @description: Removes an organization from the database
  ###
  def destroy
    begin
      @organization.destroy!
      flash[:info] = t("alerts.successfully_deleted", record: Organization.name)
    rescue ActiveRecord::RecordNotDestroyed
      # @todo: Implement error handling class/module to avoid "fat controllers" known issue
      flash[:error] = t(
        "alerts.errors.cannot_delete_because_has_relation",
        record: Organization.name.downcase,
        relation: User.name.pluralize.downcase
      )
    end

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

  ###
  # @description: Clean params
  # @return [ActionController::Parameters]
  ###
  def permitted_params
    params.require(:organization).permit(:name)
  end
end
