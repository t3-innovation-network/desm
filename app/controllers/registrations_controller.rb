# frozen_string_literal: true

###
# @description: Manage all the sessions logic
###
class RegistrationsController < ApplicationController
  ###
  # @description: Creates a user, using the params sent in the HTTP request.
  # @return [String]
  ###
  def create
    user = User.create!(request_params)
    user.assign_role(params[:role_id])

    render json: {
      success: true
    }
  end

  private

  ###
  # @description: Group the necessary params to create a user, including
  #   password, which is automatically assigned
  # @return [ActionController::Parameters]
  ###
  def request_params
    permitted_params.merge(
      password: Desm::DEFAULT_PASS,
      password_confirmation: Desm::DEFAULT_PASS
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
