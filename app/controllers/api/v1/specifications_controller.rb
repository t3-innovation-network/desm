# frozen_string_literal: true

###
# @description: Place all the actions related to specifications
###
module API
  module V1
    class SpecificationsController < BaseController
      include ConfigurationProfileQueryable

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

        if (domain = params[:domain]).present?
          specifications = specifications.joins(:domain).where(domains: { pref_label: domain })
        end

        render json: specifications.joins(:mappings).where(mappings: { status: "mapped" }).distinct.order(name: :asc)
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

      private

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
        params.require(:specification).permit(:name, :scheme, :uri, :version)
      end
    end
  end
end
