# frozen_string_literal: true

module NestedInConfigurationProfile
  extend ActiveSupport::Concern

  included do
    before_action :set_configuration_profile

    def current_configuration_profile
      set_configuration_profile if @configuration_profile.nil?

      @configuration_profile
    end

    def set_configuration_profile
      return if current_user.nil?

      @configuration_profile = Resources::ConfigurationProfilePolicy::Scope.new(
        UserContext.new(current_user), ConfigurationProfile
      ).resolve.find(params[:configuration_profile_id])
    end
  end
end
