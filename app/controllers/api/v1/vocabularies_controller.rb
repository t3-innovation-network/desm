# frozen_string_literal: true

###
# @description: Place all the actions related to vocabularies
###
class Api::V1::VocabulariesController < ApplicationController
  before_action :authorize_with_policy

  ###
  # @description: Returns the list of vocabularies for the logged in
  #   user's organization
  ###
  def index
    vocabularies = begin
      if current_user.super_admin?
        Vocabulary.all
      else
        current_user.organization.vocabularies.order(:name)
      end
    end

    render json: vocabularies
  end

  ###
  # @description: Returns a specific vocabulary
  ###
  def show
    parser = Parsers::Skos.new(
      context: @instance.context,
      graph: @instance.concepts.map {|concept|
        concept.raw.merge(key: concept.id)
      }
    )

    render json: {
      "name": @instance.name,
      "concepts": parser.concepts_list_simplified
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
      "@graph": [@instance.content].concat(@instance.concepts.map {|concept|
        concept.raw.merge(key: concept.id)
      })
    }
  end

  ###
  # @description: Creates a vocabulary
  ###
  def create
    processor = Processors::Vocabularies.new(permitted_params[:content])

    @instance = processor.create(permitted_params[:name], current_user.organization)

    render json: @instance, include: :concepts
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
    params.require(:vocabulary).permit(:name, {content: {}})
  end
end
