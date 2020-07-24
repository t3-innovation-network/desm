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

  # Set a default password for every new user, since it's not created by itself,
  # but by an administrator
  DEFAULT_PASS = "t3user123"

  ###
  # @description: Lists all the users with its organizations
  ###
  def index
    @organizations = Organization.all
    @users = User.all
  end

  ###
  # @description: Displays the form to create a new user. We need the
  #   organizations and roles in order to assign it to the user
  ###
  def new
    @user = User.new
    @organizations = Organization.all
    @roles = Role.all
  end

  ###
  # @description: Adds a new user to the database
  ###
  def create
    @user = User.create(permitted_params.merge(password: DEFAULT_PASS))

    if @user.save
      Assignment.new(user_id: @user.id, role_id: params[:role_id])
      flash[:notice] = t("alerts.successfully_added", record: User.name)
    end

    redirect_to admin_users_path
  end

  ###
  # @description: Prepares the data for the edit form
  ###
  def edit
    @user = User.find(params[:id])
    @organizations = Organization.all
    @roles = Role.all
  end

  ###
  # @description: Udates the attributes of a user
  ###
  def update
    flash[:notice] = t("alerts.successfully_updated", record: User.name) if @user.update(permitted_params)

    redirect_to admin_users_path
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

  ###
  # @description: Clean params
  # @return [ActionController::Parameters]
  ###
  def permitted_params
    params.require(:user).permit(:email, :fullname, :password, :organization_id, :role_id)
  end
end
