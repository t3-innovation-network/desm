# frozen_string_literal: true

class ApplicationController < ActionController::Base
  # We manage our own security for sessions
  skip_before_action :verify_authenticity_token
end
