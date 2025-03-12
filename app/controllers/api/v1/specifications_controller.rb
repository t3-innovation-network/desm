# frozen_string_literal: true

###
# @description: Place all the actions related to specifications
###
module API
  module V1
    class SpecificationsController < BaseController
      include ConfigurationProfileQueryable
      before_action :authorize_with_policy, only: :update

      ###
      # @description: Lists all the specifications
      ###
      def index
        specifications =
          if current_configuration_profile
            current_configuration_profile.specifications
          else
            Specification.all
          end

        specifications = specifications.mapped
        specifications = specifications.where(domain_id: params[:domain_id]) if params[:domain_id].present?

        render json: specifications.distinct.order(name: :asc), base: true
      end

      ###
      # @description: Create a specification with its terms. Store it from an already
      #   filtered JSON object
      ###
      def create
        spec = Processors::Specifications.create(valid_params)

        render json: spec
      end

      ###
      # @description: Returns the specification with id equal to the one passed in params
      ###
      def show
        @specification = Specification.find(params[:id])

        render json: @specification, include: %i(user domain)
      end

      ###
      # @description: Delete the given specification from the database
      ###
      def destroy
        current_configuration_profile.spines.find(params[:id]).destroy

        render json: {
          success: true
        }
      end

      def update
        spec = Processors::Specifications.update(valid_params, instance: @instance)

        render json: spec
      end

      private

      def authorize_with_policy
        authorize(instance)
      end

      ###
      # @description: Clean the parameters with all needed for specifications creation
      # @return [ActionController::Parameters]
      ###
      def valid_params
        permitted_params.merge(
          configuration_profile_user: current_configuration_profile_user,
          domain_id: params[:specification][:domain_id],
          # We assume we received one only file with all the data
          spec: params[:specification][:content],
          selected_domains: params[:specification][:selected_domains]
        )
      end

      ###
      # @description: Clean params
      # @return [ActionController::Parameters]
      ###
      def permitted_params
        params.require(:specification).permit(:name, :scheme, :uri, :version, :mapping_id)
      end

      def instance
        @instance ||= policy_scope(Specification).find(params[:id])
      end
    end
  end
end
