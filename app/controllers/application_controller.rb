# frozen_string_literal: true

class ApplicationController < ActionController::Base
  # Authorization handling
  include Pundit::Authorization

  # Handle errors with a concern
  include Recoverable

  # We manage our own security for sessions
  skip_before_action :verify_authenticity_token

  # Handle unauthorized accesses with a json error message
  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized

  ###
  # @description: Create a class instance of the model being represented
  # @return [Object] an instance of the class being represented
  ###
  def with_instance model_name=nil
    model_name = controller_name.classify.constantize unless model_name.present?
    @instance = params[:id].present? ? model_name.find(params[:id]) : model_name.new
  end

  ###
  # @description: Returns a 404 json response
  ###
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
  # @description: Returns a json message when an error happens due to an unpermittted
  #   access to an action
  # @param [Exception] _exception The exception that was raised
  ###
  def user_not_authorized(_exception)
    render json: {error: t("errors.auth.unauthorized_access")}, status: :unauthorized
  end
end
