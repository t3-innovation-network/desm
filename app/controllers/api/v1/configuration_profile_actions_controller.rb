# frozen_string_literal: true

class InvalidConfigurationProfileAction < StandardError; end

class API::V1::ConfigurationProfileActionsController < ApplicationController
  before_action :with_instance, only: :call_action

  def call_action
    action = permitted_actions

    if action == :export!
      render json: Exporters::ConfigurationProfile.new(@instance).export
      return
    end

    @instance.send(action)
    render json: @instance.reload, include: [standards_organizations: {include: :users}]
  rescue CpState::NotYetReadyForTransition => e
    message =
      if @instance.incomplete?
        ConfigurationProfile.validate_structure(@instance.structure, "complete")
      else
        e.message
      end

    render json: {message: message}, status: :internal_server_error
  end

  private

  def with_instance
    @instance = ConfigurationProfile.find(params[:id])
  end

  def permitted_actions
    permitted = params.require(:configuration_profile).permit(:action)
    action = permitted[:action].to_sym
    raise InvalidConfigurationProfileAction unless %i[activate! complete! deactivate! export!].include?(action)

    action
  end
end
