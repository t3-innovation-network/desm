# frozen_string_literal: true

module API
  module V1
    class AgentsController < BaseController
      include AuthAdmin

      def index
        authorize User, policy_class: AgentPolicy
        @agents = AgentsQuery.call(policy_scope(User, policy_scope_class: AgentPolicy::Scope), params: agents_params)

        render json: @agents.includes(:configuration_profile_users), each_serializer: AgentSerializer,
               with_configuration_profiles: true
      end

      def filters
        render json: {
          organizations: serialize_filters_for(policy_scope(Organization)),
          configuration_profiles: serialize_filters_for(policy_scope(ConfigurationProfile).activated),
          states: ConfigurationProfile.activated_states_for_select
        }
      end

      private

      def agents_params
        params.permit(:search, configuration_profile_ids: [], configuration_profile_states: [], organization_ids: [])
      end

      def serialize_filters_for(data)
        ActiveModel::Serializer::CollectionSerializer.new(data.order(:name), serializer: PreviewSerializer)
      end
    end
  end
end
