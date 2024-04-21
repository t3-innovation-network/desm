# frozen_string_literal: true

module NestedInConfigurationProfile
  extend ActiveSupport::Concern

  included do
    before_action :set_configuration_profile

    def current_configuration_profile
      @configuration_profile
    end

    def set_configuration_profile
      @configuration_profile = policy_scope(ConfigurationProfile).find(params[:configuration_profile_id])
    end
  end
end
