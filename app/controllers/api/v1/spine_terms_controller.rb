# frozen_string_literal: true

###
# @description: Place all the actions related to spine terms
###
module API
  module V1
    class SpineTermsController < BaseController
      include ConfigurationProfileQueryable
      before_action :validate_mapped_terms, only: [:create]
      after_action :set_mapped_terms, only: [:create]

      def index
        includes = %i(property)
        includes += %i(vocabularies) unless params[:spine].present?
        includes += %i(organization) if params[:with_organization].present?
        terms = Spine.find(params[:id]).terms.includes(includes)

        render json: terms, spine: params[:with_weights].present?,
               with_organization: params[:with_organization].present?
      end

      ###
      # @description: Creates a new (synthetic) term for the spine, along with its alignment
      ###
      def create
        result = CreateSyntheticTerm.call(params: permitted_params)
        @alignment = result.alignment
        render json: @alignment
      end

      private

      ###
      # @description: Clean params
      # @return [ActionController::Parameters]
      ###
      def permitted_params
        params.require(:synthetic).permit(
          :spine_id,
          :spine_term_id,
          alignment: %i(
            comment predicate_id mapping_id uri synthetic
          )
        )
      end

      ###
      # @description: Ensure we have the mapped terms in order to add the new synthetic term to the spine
      ###
      def validate_mapped_terms
        raise ArgumentError, "No mapped terms provided for synthetic" \
          unless params[:synthetic][:alignment][:mapped_terms].present?
      end

      ###
      # @description: Set the mapped terms to the recently created alignment
      ###
      def set_mapped_terms
        @alignment.update_mapped_terms(params[:synthetic][:alignment][:mapped_terms])
      end
    end
  end
end
