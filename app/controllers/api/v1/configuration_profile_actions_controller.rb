# frozen_string_literal: true

class InvalidConfigurationProfileAction < StandardError; end

class Api::V1::ConfigurationProfileActionsController < ApplicationController
  before_action :with_instance, only: :call_action

  def call_action
    action = permitted_actions
    @instance.send(action)

    render json: @instance.reload, include: [standards_organizations: {include: :users}]
  end

  private

  def with_instance
    @instance = ConfigurationProfile.find(params[:id])
  end

  def permitted_actions
    permitted = params.require(:configuration_profile).permit(:action)
    action = permitted[:action].to_sym
    raise InvalidConfigurationProfileAction unless %i[activate! complete! deactivate! export! remove!].include?(action)

    action
  end
end
