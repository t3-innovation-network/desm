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
    user = User.create!(
      permitted_params.merge(
        password: DEFAULT_PASS,
        password_confirmation: DEFAULT_PASS
      )
    )

    Assignment.create!(user_id: user.id, role_id: params[:role_id])

    if user
      session[:user_id] = user.id
      render json: {
        status: :created,
        user: user
      }
    else
      render json: {status: 500}, status: :internal_server_error
    end
  end

  private

  ###
  # @description: Clean params
  # @return [ActionController::Parameters]
  ###
  def permitted_params
    params.require(:user).permit(:email, :fullname, :organization_id)
  end
end
