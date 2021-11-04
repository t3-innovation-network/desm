# frozen_string_literal: true

class Api::V1::ConfigurationProfileSchemasController < ApplicationController
  def show
    render json: determine_schema
  end

  private

  def determine_schema
    case permitted_params[:name]
    when 'valid'
      return ConfigurationProfile::valid_schema  
    when 'complete'
      return ConfigurationProfile::complete_schema
    else
      raise "Invalid schema name"
    end
  end

  def permitted_params
    params.permit(:name)
  end
end
