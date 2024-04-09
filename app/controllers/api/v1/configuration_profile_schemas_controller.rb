# frozen_string_literal: true

module API
  module V1
    class ConfigurationProfileSchemasController < BaseController
      def show
        render json: determine_schema
      end

      private

      def determine_schema
        case permitted_params[:name]
        when "valid"
          ConfigurationProfile.valid_schema
        when "complete"
          ConfigurationProfile.complete_schema
        else
          raise "Invalid schema name"
        end
      end

      def permitted_params
        params.permit(:name)
      end
    end
  end
end
