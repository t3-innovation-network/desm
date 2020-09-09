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
           .find_by(email: params["user"]["email"])
           .try(:authenticate, params["user"]["password"])

    raise InvalidCredentials unless user

    session[:user_id] = user.id

    render json: user, include: %i[roles organization]
  end

  ###
  # @description: Answers the question: Is there any user logged in?
  # @return [String]
  ###
  def session_status
    if @current_user
      render json: @current_user, include: %i[roles organization]
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
      logged_out: true
    }
  end
end
