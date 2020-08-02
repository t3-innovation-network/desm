# frozen_string_literal: true

###
# @description: Place all the actions related to users
###
class UsersController < ApplicationController
  before_action :authorize_with_policy

  include Pundit

  ###
  # @description: Lists all the users with its organizations
  ###
  def index
    @users = User.all.order(fullname: :desc)

    if @users
      render json: @users, include: :organization
    else
      render json: {status: 500}, status: :internal_server_error
    end
  end

  ###
  # @description: Returns the user with id equal to the one passed in params
  ###
  def show
    if @user
      render json: @user, include: :assignments
    else
      render json: {status: 500}, status: :internal_server_error
    end
  end

  ###
  # @description: Udates the attributes of a user
  ###
  def update
    @user.update(permitted_params)
    @user.update_role(params[:role_id])

    render json: @user
  end

  ###
  # @description: Removes a user from the database
  ###
  def destroy
    if @user.destroy!
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
  def authorize_with_policy
    authorize user
  end

  ###
  # @description: Get the current user
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
    params.require(:user).permit(:email, :fullname, :organization_id)
  end
end
