# frozen_string_literal: true

###
# @description: Manage all the sessions logic
###
class RegistrationsController < ApplicationController
  # Set a default password for every new user, since it's not created by itself,
  # but by an administrator
  DEFAULT_PASS = "t3user123"

  ###
  # @description: Creates a user, using the params sent in the HTTP request.
  # @return [String]
  ###
  def create
    user = User.create!(request_params)
    user.assign_role(params[:role_id])
    session[:user_id] = user.id

    render json: user
  end

  private

  ###
  # @description: Group the necessary params to create a user, including
  #   password, which is automatically assigned
  # @return [ActionController::Parameters]
  ###
  def request_params
    permitted_params.merge(
      password: DEFAULT_PASS,
      password_confirmation: DEFAULT_PASS
    )
  end

  ###
  # @description: Clean params
  # @return [ActionController::Parameters]
  ###
  def permitted_params
    params.require(:user).permit(:email, :fullname, :organization_id)
  end
end
