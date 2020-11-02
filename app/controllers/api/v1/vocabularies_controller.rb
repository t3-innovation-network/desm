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
    vocabularies = current_user.organization.vocabularies.order(:name)

    render json: vocabularies
  end

  ###
  # @description: Returns a specific vocabulary
  ###
  def show
    render json: @vocabulary, include: :concepts
  end

  ###
  # @description: Creates a vocabulary
  ###
  def create
    @vocabulary = Processors::Skos
                  .create({
                            organization: current_user.organization,
                            attrs: permitted_params
                          })

    render json: @vocabulary, include: :concepts
  end

  private

  ###
  # @description: Execute the authorization policy
  ###
  def authorize_with_policy
    authorize vocabulary
  end

  ###
  # @description: Get the current model record
  # @return [ActiveRecord]
  ###
  def vocabulary
    @vocabulary = params[:id].present? ? Vocabulary.find(params[:id]) : (Vocabulary.first || Vocabulary)
  end

  ###
  # @description: Clean params
  # @return [ActionController::Parameters]
  ###
  def permitted_params
    params.require(:vocabulary).permit(:name, {content: {}})
  end
end
