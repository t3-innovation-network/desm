# frozen_string_literal: true

###
# @description: Place all the actions related to mappings
###
module API
  module V1
    class MappingExportsController < BaseController
      include ConfigurationProfileQueryable

      ###
      # @description: Returns exported mappings in a given format as binary
      ###
      def index
        domains = current_configuration_profile
                    .domains
                    .where(id: Array.wrap(params.fetch(:domain_ids, "").split(",")))

        mapping = current_configuration_profile
                    .mappings
                    .find_by(id: params[:mapping_id])

        if domains.empty? && mapping.nil?
          render json: { error: "Either domain_ids or mapping_id is required" }, status: :bad_request
          return
        end

        result = ExportMappings.call(
          configuration_profile: current_configuration_profile,
          domains:,
          format: params[:format],
          mapping:
        )

        if result.success?
          send_data result.data,
                    filename: result.filename,
                    type: result.content_type
        else
          render json: { error: response.error }, status: :unprocessable_entity
        end
      rescue StandardError => e
        Airbrake.notify(e)
        render json: { error: e.message }, status: :internal_server_error
      end
    end
  end
end
