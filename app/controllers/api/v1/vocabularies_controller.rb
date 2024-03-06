# frozen_string_literal: true

###
# @description: Place all the actions related to vocabularies
###
module API
  module V1
    class VocabulariesController < BaseController
      before_action :authorize_with_policy

      ###
      # @description: Returns the list of vocabularies for the logged in
      #   user's organization
      ###
      def index
        vocabularies = if current_user.super_admin?
                         Vocabulary.all
                       else
                         current_configuration_profile.vocabularies.order(:name)
                       end

        render json: vocabularies
      end

      ###
      # @description: Returns a specific vocabulary
      ###
      def show
        parser = Parsers::Skos.new(
          context: @instance.context,
          graph: @instance.concepts.map do |concept|
            concept.raw.merge(key: concept.id)
          end
        )

        render json: {
          name: @instance.name,
          concepts: parser.concepts_list_simplified
        }
      end

      ###
      # @description: returns the vocabulary with the json structure as it is. Without ids
      #   nor internal representation data. This endpoint will give us a vocabulary with the
      #   exact structure we need: A JSON object with a "@context" and a "@graph".
      ###
      def flat
        render json: {
          "@context": @instance.context,
          "@graph": [@instance.content].concat(@instance.concepts.map do |concept|
            concept.raw.merge(key: concept.id)
          end)
        }
      end

      ###
      # @description: Creates a vocabulary
      ###
      def create
        processor = Processors::Vocabularies.new(permitted_params[:content].to_h)

        @instance = processor.create(permitted_params[:name], current_configuration_profile)

        render json: @instance, include: :concepts
      end

      ###
      # @description: Extracts vocubularies from an uploaded file
      ###
      def extract
        content = params[:content].to_unsafe_h
        parser = Parsers::Specification.new(file_content: content)
        processor = Processors::Specifications.new(parser.to_jsonld)
        render json: processor.filter_vocabularies
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
        params.require(:vocabulary).permit(:name, { content: {} })
      end
    end
  end
end
