# frozen_string_literal: true

class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  # Protect all routes to be accessible only with authentication
  # It can be overriden in any controller with `skip_before_action`
  before_action :authenticate_user!
end
