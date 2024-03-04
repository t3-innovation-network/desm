# frozen_string_literal: true

###
# @description: Parse and return the result of fetching a skos structure through a URL
###
module API
  module V1
    class SkosController < BaseController
      before_action :validate_labels_params, only: :labels
      before_action :instantiate_cp, only: :labels
      before_action :check_skos_method, only: :labels

      def fetch
        response = FetchSkosFile.call(uri: params[:uri])

        if response.error
          return render json: {
            error: response.error
          }
        end

        render json: {
          valid: response.valid,
          skos_file: response.skos_file,
          concept_names: response.concept_names
        }
      end

      def labels
        response = FetchCpData.call(skos_method: params[:skos_method].to_sym, configuration_profile: @cp)

        if response.success?
          render json: {
            concept_names: response.concept_names
          }
        else
          render json: { error: response.error }, status: :unprocessable_entity
        end
      end

      private

      def validate_labels_params
        params.permit(:configuration_profile_id, :skos_method)
        return if %w(json_mapping_predicates json_abstract_classes).include?(params[:skos_method])

        raise "skos method should be one of: 'json_mapping_predicates', 'json_abstract_classes"
      end

      def instantiate_cp
        @cp = ConfigurationProfile.find(params[:configuration_profile_id])
      end

      def check_skos_method
        raise "skos_method missing" unless params[:skos_method].present?
        raise "#{params[:skos_method].humanize} is empty" if @cp.send(params[:skos_method].to_sym).nil?
      end
    end
  end
end
