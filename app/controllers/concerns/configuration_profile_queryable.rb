# frozen_string_literal: true

module ConfigurationProfileQueryable
  extend ActiveSupport::Concern

  included do
    before_action :set_configuration_profile, only: :index

    def set_configuration_profile
      return unless params[:configuration_profile_id].present?

      @current_configuration_profile = ConfigurationProfile.find(params[:configuration_profile_id])
      raise Pundit::NotAuthorizedError unless @current_configuration_profile.with_shared_mappings?
    end
  end
end
