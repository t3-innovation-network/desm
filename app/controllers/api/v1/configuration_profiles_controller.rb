# frozen_string_literal: true

class Api::V1::ConfigurationProfilesController < ApplicationController
  before_action :with_instance, only: %i[destroy show update]

  def create
    cp = ConfigurationProfile.create!(creation_params)
    cp.update_attribute(:name, permitted_params[:name]) if permitted_params[:name]

    render json: cp
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

  def show
    render json: @instance, include: [standards_organizations: {include: :users}]
  end

  def update
    @instance.update(permitted_params)

    render json: @instance, include: [standards_organizations: {include: :users}]
  end

  private

  def creation_params
    permitted_params.merge({name: DEFAULT_CP_NAME, administrator: @current_user})
  end

  def permitted_params
    params.require(:configuration_profile).permit(VALID_PARAMS_LIST)
  end
end
