# frozen_string_literal: true

###
# @description: Place all the actions related to mappings
###
module API
  module V1
    class MappingSelectedTermsController < BaseController
      before_action :validate_mapping_terms, only: [:create]
      before_action :instantiate

      ###
      # @description: Creates the selected mapping terms. This method is used when the user has already
      #   decided which terms to map to the spine
      ###
      def create
        # Proceed to create the mapping terms
        @instance.update_selected_terms(params[:term_ids])

        render json: @instance, spine: true
      end

      ###
      # @description: Fetch the mapping terms for the mapping with the id equal
      #   to the one passed in params
      ###
      def show
        render json: @instance.selected_terms.includes(%i(property vocabularies)).order(:source_uri)
      end

      ###
      # @description: Removes a term from the selected terms of a mapping
      ###
      def destroy
        term = Term.find(params[:term_id])

        Mapping.transaction do
          @instance.selected_terms.delete(term)

          @instance
            .alignments
            .joins(:mapped_terms)
            .where(terms: { id: term })
            .each { |a| a.update!(mapped_terms: [], predicate: nil) }
        end

        render json: @instance
      end

      private

      ###
      # @description: Get the instance of the mapping to work with
      ###
      def instantiate
        with_instance(Mapping)
      end

      ###
      # @description: Validates that mapping terms are passed in params
      ###
      def validate_mapping_terms
        raise "Mapping terms were not provided" unless params[:term_ids].present? && params[:term_ids].length.positive?
      end
    end
  end
end
