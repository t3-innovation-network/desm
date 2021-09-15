# frozen_string_literal: true

class Api::V1::ConfigurationProfilesController < ApplicationController
  before_action :with_instance, only: :destroy
  DEFAULT_CP_NAME = "Desm CP - #{DateTime.now.rfc3339}"

  def create
    cp = ConfigurationProfile.create!(creation_params)

    render json: {
      success: true,
      configuration_profile: cp
    }
  end

  def index
    cps = ConfigurationProfile.order(name: :asc)

    render json: cps, include: [standards_organizations: {include: :users}]
  end

  def destroy
    @instance.remove!

    render json: {
      success: true
    }
  end

  private

  def creation_params
    permitted_params.merge({name: DEFAULT_CP_NAME, administrator: @current_user})
  end

  def permitted_params
    params.require(:configuration_profile).permit(:name, :description, :structure)
  end
end
