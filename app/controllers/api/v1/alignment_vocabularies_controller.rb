# frozen_string_literal: true

###
# @description: Place all the actions related to vocabulary mappings
###
module API
  module V1
    class AlignmentVocabulariesController < BaseController
      ###
      # @description: Returns the vocabulary mapping for a specific alignment,
      #   with its concepts
      ###
      def show
        alignment = Alignment.find(params[:id])

        vocabulary = alignment.vocabulary ||= AlignmentVocabulary.create!(
          alignment_id: alignment.id,
          title: "Vocabulary for #{alignment.uri}"
        )

        render json: vocabulary.concepts
      end
    end
  end
end
