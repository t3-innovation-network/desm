# frozen_string_literal: true

###
# @description: Place all the actions related to users
###
class Admin::UsersController < ApplicationController
  # We use a different template for this controller, in order the make a
  # difference between the public and the restricted html templates
  layout "admin"
  before_action :authorize_with_policy

  include Pundit

  ###
  # @description: Lists all the users with its organizations
  ###
  def index
    @organizations = Organization.all
    @users = User.all
  end

  ###
  # @description: Removes a user from the database
  ###
  def destroy
    @user.destroy!
    flash[:info] = t("alerts.successfully_deleted", record: User.name)
    redirect_to admin_users_path
  end

  private

  ###
  # @description: Execute the authorization policy
  ###
  def authorize_with_policy
    authorize user
  end

  ###
  # @description: Get the current model record
  # @return [ActiveRecord]
  ###
  def user
    @user = @user || params[:id].present? ? User.find(params[:id]) : User.first
  end
end
