# frozen_string_literal: true

module API
  class BaseController < ApplicationController
    # Handle errors with a json error message
    rescue_from ArgumentError do |e|
      render json: { error: e.message }, status: :unprocessable_entity
    end

    rescue_from ActionController::ParameterMissing do |e|
      render json: { error: e.message }, status: :unprocessable_entity
    end

    rescue_from ActiveRecord::RecordNotFound do |_e|
      render json: { error: "Not found" }, status: :not_found
    end

    rescue_from ActiveRecord::RecordInvalid do |e|
      render json: { error: e.record.errors.full_messages.join(", ") }, status: :unprocessable_entity
    end
  end
end
