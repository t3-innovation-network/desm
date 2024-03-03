# frozen_string_literal: true

###
# @description: Place all the actions related to users
###
class UsersController < API::BaseController
  before_action :authorize_with_policy

  ###
  # @description: Lists all the users with its organizations
  ###
  def index
    @users = User.all.order(fullname: :desc)

    render json: @users, include: :organization
  end

  ###
  # @description: Returns the user with id equal to the one passed in params
  ###
  def show
    render json: @user, include: :assignments
  end

  ###
  # @description: Udates the attributes of a user
  ###
  def update
    @user.update!(permitted_params)
    @user.update_role(params[:role_id]) if params[:role_id].present?

    render json: @user
  end

  ###
  # @description: Removes a user from the database
  ###
  def destroy
    @user.destroy!

    render json: {
      status: :removed
    }
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
    @user = params[:id].present? ? User.find(params[:id]) : User.first
  end

  ###
  # @description: Clean params
  # @return [ActionController::Parameters]
  ###
  def permitted_params
    params.require(:user).permit(:email, :fullname, :github_handle, :phone)
  end
end
