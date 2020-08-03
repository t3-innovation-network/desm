# frozen_string_literal: true

class ApplicationController < ActionController::Base
  # Authorization handling
  include Pundit

  # Handle errors with a concern
  include Recuperable

  # We manage our own security for sessions
  skip_before_action :verify_authenticity_token

  # Handle unauthorized accesses with a json error message
  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized

  def not_found
    render json: {error: t("errors.not_found")}, status: :not_found
  end

  private

  ###
  # @description: Returns the current user from the session
  ###
  def current_user
    return unless session[:user_id]

    @current_user ||= User.find(session[:user_id])
  end

  ###
  # @description: Reutn a json message when an error happens due to an unpermittted
  #   access to an action
  # @param [Exception] _exception The exception that was raised
  ###
  def user_not_authorized(_exception)
    render json: {error: t("errors.auth.unauthorized_access")}
  end
end
