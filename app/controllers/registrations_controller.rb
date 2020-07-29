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
    user = User.create!(
      email: params["user"]["email"],
      password: params["user"]["password"],
      password_confirmation: params["user"]["password_confirmation"]
    )

    if user
      session[:user_id] = user.id
      render json: {
        status: :created,
        user: user
      }
    else
      render json: {status: 500}
    end
  end
end
