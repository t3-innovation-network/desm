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
                         current_configuration_profile.vocabularies
                       end

        render json: vocabularies.order(:name, :version)
      end

      def predicates
        render json: AlignmentVocabulary.predicate_set.predicates.includes(:predicate_set)
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
          name_with_version: @instance.name_with_version,
          version: @instance.version,
          concepts: parser.concepts_list_simplified
        }
      end

      def concepts
        concepts = [].tap do |data|
          params[:ids].split(",").each do |id|
            vocabulary = Vocabulary.find(id)
            parser = Parsers::Skos.new(
              context: vocabulary.context,
              graph: vocabulary.concepts.map do |concept|
                concept.raw.merge(key: concept.id)
              end
            )

            data << {
              name: vocabulary.name,
              concepts: parser.concepts_list_simplified
            }
          end
        end

        render json: concepts
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
        render json: @instance, with_concepts: true
      end

      ###
      # @description: Extracts vocubularies from an uploaded file
      ###
      def extract
        content = Parsers::FormatConverter.convert_content_to_jsonld(**extract_params.to_h.symbolize_keys)
        parser = Parsers::Specification.new(file_content: content)
        processor = Processors::Specifications.new(parser.to_jsonld)
        render json: processor.filter_vocabularies(current_configuration_profile)
      end

      ###
      # @description: Assigns vocabularies to a spine term based on the provided parameters.
      ###
      def spine_term
        spine_term = current_configuration_profile.terms.find(spine_term_params[:spine_term_id])
        terms = current_configuration_profile.terms.where(id: spine_term_params[:ids])
        if spine_term.vocabularies.blank?
          spine_term.vocabularies = terms.flat_map(&:vocabularies).uniq if spine_term.vocabularies.blank?
          spine_term.save!
        end

        data = spine_term.vocabularies.map do |vocabulary|
          concepts_for(vocabulary)
        end

        render json: data, status: :ok
      end

      private

      ###
      # @description: Execute the authorization policy
      ###
      def authorize_with_policy
        authorize(with_instance)
      end

      def concepts_for(vocabulary)
        parser = Parsers::Skos.new(
          context: vocabulary.context,
          graph: vocabulary.concepts.map do |concept|
            concept.raw.merge(key: concept.id)
          end
        )

        { name: vocabulary.name,
          concepts: parser.concepts_list_simplified }
      end

      def extract_params
        params.permit(:file, :url, :content)
      end

      ###
      # @description: Clean params
      # @return [ActionController::Parameters]
      ###
      def permitted_params
        params.require(:vocabulary).permit(:name, { content: {} })
      end

      def spine_term_params
        params.permit(:spine_term_id, ids: [])
      end
    end
  end
end
