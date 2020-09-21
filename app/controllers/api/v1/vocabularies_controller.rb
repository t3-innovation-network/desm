# frozen_string_literal: true

###
# @description: Place all the actions related to vocabularies
###
class Api::V1::VocabulariesController < ApplicationController
  before_action :authorize_with_policy

  include Pundit

  ###
  # @description: Returns the list of vocabularies for the logged in
  #   user's organization
  ###
  def index
    vocabularies = Vocabulary.all.order(name: :desc)
    render json: vocabularies
  end

  ###
  # @description: Creates a vocabulary
  ###
  def create
    @vocabulary = Vocabulary.create!(valid_params)

    render json: {
      success: true,
      vocabulary: @vocabulary
    }
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
  # @description: Let's ensure the content is a valid json before
  #   creating a vocabulary. Also validate the organization is the
  #   current users's organization
  # @return [ActionController::Parameters]
  ###
  def valid_params
    params = permitted_params.merge(
      organization: current_user.organization
    )
    params[:content] = JSON.parse(params[:content])
    params
  end

  ###
  # @description: Clean params
  # @return [ActionController::Parameters]
  ###
  def permitted_params
    params.require(:vocabulary).permit(:name, :content)
  end
end
