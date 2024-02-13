# frozen_string_literal: true

###
# @description: Manage all the sessions logic
###
class SessionsController < ApplicationController
  include CurrentUserConcern

  ###
  # @description: Creates a session, trying to authenticate the user
  #   with the params sent in the HTTP request.
  # @return [String]
  ###
  def create
    user = User
             .where("LOWER(email) = ?", params.dig(:user, :email).downcase)
             .first
             .try(:authenticate, params.dig(:user, :password))

    raise InvalidCredentials unless user

    session[:user_id] = user.id

    render json: user
  end

  ###
  # @description: Answers the question: Is there any user logged in?
  # @return [String]
  ###
  def session_status
    if @current_user
      render json: {
        logged_in: true,
        user: @current_user
      }
    else
      render json: {
        logged_in: false
      }
    end
  end

  ###
  # @description: Destroys the user session
  # @return [String]
  ###
  def logout
    reset_session
    render json: {
      status: 200,
      success: true
    }
  end
end
