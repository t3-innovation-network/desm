# frozen_string_literal: true

module API
  module V1
    class ConfigurationProfilesController < API::V1::ConfigurationProfilesAbstractController
      before_action :with_instance, only: %i(destroy show update set_current)

      def create
        cp = ConfigurationProfile.create!(creation_params)
        cp.update_attribute(:name, permitted_params[:name]) if permitted_params[:name]

        render json: cp
      end

      def index
        fields = ["configuration_profiles.*"]

        configuration_profiles =
          if current_user && !current_user.super_admin?
            current_user
              .configuration_profile_users
              .joins(:configuration_profile, :organization)
              .select(*fields, :lead_mapper, "organizations.id organization_id, organizations.id AS organization")
          else
            ConfigurationProfile.select(*fields)
          end

        render json: configuration_profiles.order(:name)
      end

      def destroy
        @instance.remove!

        render json: {
          success: true
        }
      end

      def show
        render json: @instance, include: [standards_organizations: { include: :users }]
      end

      def update
        @instance.update(permitted_params)

        render json: @instance, include: [standards_organizations: { include: :users }]
      end

      def set_current
        session[:current_configuration_profile_id] = @instance.id
        head :ok
      end

      def import
        Importers::ConfigurationProfile
          .new(params[:data].permit!, name: params[:name])
          .import

        head :ok
      rescue StandardError => e
        render json: { error: e.message }
      end

      private

      def creation_params
        permitted_params.merge({ name: DEFAULT_CP_NAME, administrator: @current_user })
      end

      def permitted_params
        params.require(:configuration_profile).permit(VALID_PARAMS_LIST)
      end
    end
  end
end
