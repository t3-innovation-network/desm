# frozen_string_literal: true

###
# @description: Place all the actions related to vocabulariy mappings
###
module API
  module V1
    class AlignmentVocabularyConceptsController < BaseController
      before_action :authorize_with_policy

      ###
      # @description: Updates a single alignment concept, firstly updating its mapped concepts
      ###
      def update
        ActiveRecord::Base.transaction do
          if params[:alignment_vocabulary_concept][:mapped_concepts].present?
            @instance.update_mapped_concepts(
              params[:alignment_vocabulary_concept][:mapped_concepts]
            )
          end
          @instance.update!(permitted_params)
        end

        render json: @instance, include: %i(mapped_concepts)
      end

      private

      ###
      # @description: Execute the authorization policy
      ###
      def authorize_with_policy
        authorize(with_instance)
      end

      ###
      # @description: Clean params
      # @return [ActionController::Parameters]
      ###
      def permitted_params
        params.require(:alignment_vocabulary_concept).permit(:predicate_id)
      end
    end
  end
end
