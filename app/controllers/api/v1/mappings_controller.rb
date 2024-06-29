# frozen_string_literal: true

###
# @description: Place all the actions related to mappings
###
module API
  module V1
    class MappingsController < BaseController
      before_action :authorize_with_policy
      before_action :instantiate_specification, only: :create

      ###
      # @description: Creates a mapping with its related specification
      ###
      def create
        @instance = Processors::Mappings.new(@specification, current_configuration_profile_user).create
        render json: @instance, status: :created
      end

      ###
      # @description: Removes a mapping from the database
      ###
      def destroy
        @instance.destroy!

        render json: {
          success: true
        }
      end

      ###
      # @description: Returns a JSON string to let the user download it as the
      #   mapping JSON-LD version.
      ###
      def export
        exporter = Exporters::Mapping.new(@instance)

        if params[:format] == "csv"
          render plain: exporter.to_csv, content_type: "text/csv"
        else
          render json: exporter.to_jsonld
        end
      end

      ###
      # @description: Lists all the mappings for the current user's organization
      ###
      def index
        mappings =
          if current_user.super_admin?
            Mapping.all
          elsif params[:filter] == "all"
            current_configuration_profile.mappings
          else
            current_configuration_profile_user.mappings
          end

        render json: mappings.includes(:organization, :selected_terms, specification: %i(domain user)).order(:title)
      end

      ###
      # @description: Fetch the mapping with the id equal to the one passed
      #   in params
      ###
      def show
        render json: @instance, spine: true
      end

      ###
      # @description: Fetch the mapping terms for the mapping with the id equal
      #   to the one passed in params
      ###
      def show_terms
        render json: @instance.alignments.includes(:mapped_terms, :predicate).order(:uri)
      end

      ###
      # @description: Updates the attributes of a mapping
      ###
      def update
        @instance.update!(permitted_params)

        render json: @instance
      end

      private

      ###
      # @description: Execute the authorization policy
      ###
      def authorize_with_policy
        authorize(with_instance)
      end

      ###
      # @description: Find the specification with the id passed in params
      ###
      def instantiate_specification
        raise ArgumentError, "Specification id not provided" unless params[:specification_id].present?

        @specification = Specification.find(params[:specification_id])
      end

      ###
      # @description: Clean params
      # @return [ActionController::Parameters]
      ###
      def permitted_params
        params.require(:mapping).permit(:status)
      end

      def with_instance
        return Mapping.new if params[:id].blank?

        @instance ||= current_organization.mappings.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        raise ArgumentError, "Couldn't find mapping"
      end
    end
  end
end
