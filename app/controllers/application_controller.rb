# frozen_string_literal: true

class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  include Pundit

  # Protect all routes to be accessible only with authentication
  # It can be overriden in any controller with `skip_before_action`
  before_action :authenticate_user!

  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized

  ###
  # @description: Prepare the data for the flash message to the user
  #   about an error that happened because an unpermittted access to
  #   an action
  # @param [Exception] _exception The exception that was raised
  ###
  def user_not_authorized(_exception)
    flash[:error] = t("errors.auth.unauthorized_action")
    redirect_to root_path
  end
end
