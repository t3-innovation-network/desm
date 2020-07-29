# frozen_string_literal: true

###
# @description: Manage all the sessions logic
###
class SessionsController < ApplicationController
  ###
  # @description: Creates a session, trying to authenticate the user
  #   with the params sent in the HTTP request.
  # @return [String]
  ###
  def create
    user = User
           .find_by(email: params["user"]["email"])
           .try(:authenticate, params["user"]["password"])

    if user
      session[:user_id] = user.id
      render json: {
        status: :created,
        logged_in: true,
        user: user
      }
    else
      render json: {
        status: 401
      }
    end
  end
end
