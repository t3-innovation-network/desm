# frozen_string_literal: true

module API
  module V1
    class ConfigurationProfilesController < API::V1::ConfigurationProfilesAbstractController
      before_action :authorize_with_policy_class, only: %i(create index index_for_user)
      before_action :authorize_with_policy, only: %i(destroy show update set_current)

      def create
        cp = ConfigurationProfile.create!(creation_params)
        cp.update_attribute(:name, permitted_params[:name]) if permitted_params[:name]

        render json: cp
      end

      def index
        render json: policy_scope(ConfigurationProfile).order(:name)
      end

      def index_shared_mappings
        render json: ConfigurationProfile.active.with_shared_mappings.order(:name), with_shared_mappings: true,
               shared_mappings: true
      end

      def index_for_user
        render json: current_user.configuration_profile_users.includes(:configuration_profile, :organization)
                       .where(configuration_profiles: { state: :active })
                       .order("configuration_profiles.name"), with_shared_mappings: true
      end

      def destroy
        @instance.remove!

        render json: { success: true }
      end

      def show
        render json: @instance, with_organizations: true
      end

      def update
        if @instance.update(permitted_params)
          render json: @instance, with_organizations: true
        else
          render json: { error: @instance.errors.full_messages.join("\\n") }, status: :unprocessable_entity
        end
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

      def authorize_with_policy_class
        authorize ConfigurationProfile
      end

      def authorize_with_policy
        authorize(with_instance)
      end

      def creation_params
        permitted_params.merge({ name: DEFAULT_CP_NAME, administrator: @current_user })
      end

      def permitted_params
        params.require(:configuration_profile).permit(VALID_PARAMS_LIST)
      end

      def with_instance
        @instance = policy_scope(ConfigurationProfile).find(params[:id])
      end
    end
  end
end
