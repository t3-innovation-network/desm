# frozen_string_literal: true

class Api::V1::ConfigurationProfilesController < ApplicationController
  before_action :with_instance, only: %i[destroy show update]
  DEFAULT_CP_NAME = "Desm CP - #{DateTime.now.rfc3339}"
  VALID_PARAMS_LIST = [
    :created_at,
    :description,
    :name,
    :updated_at,
    structure: [
      :created_at,
      :description,
      :name,
      :updated_at,
      mapping_predicates: %i[name version description origin],
      abstract_classes: %i[name version description origin],
      standards_organizations: [
        :name,
        :description,
        :homepage_url,
        :standards_page,
        dso_administrator: %i[fullname email phone github_handle],
        dso_agents: []
      ]
    ]
  ].freeze

  def create
    cp = ConfigurationProfile.create!(creation_params)

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
