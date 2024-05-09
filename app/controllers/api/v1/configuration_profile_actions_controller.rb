# frozen_string_literal: true

class InvalidConfigurationProfileAction < StandardError; end

module API
  module V1
    class ConfigurationProfileActionsController < BaseController
      before_action :with_instance, only: :call_action

      def call_action
        action = permitted_actions

        if action == :export!
          render json: Exporters::ConfigurationProfile.new(@instance).export
          return
        end

        @instance.send(action)
        render json: @instance.reload, with_organizations: true
      end

      private

      def with_instance
        @instance = policy_scope(ConfigurationProfile).find(params[:id])
      end

      def permitted_actions
        permitted = params.require(:configuration_profile).permit(:action)
        action = permitted[:action].to_sym
        raise InvalidConfigurationProfileAction unless %i(activate! complete! deactivate! export!).include?(action)

        action
      end
    end
  end
end
