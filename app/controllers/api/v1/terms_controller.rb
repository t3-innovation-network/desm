# frozen_string_literal: true

###
# @description: Place all the actions related to terms
###
class Api::V1::TermsController < ApplicationController
  before_action :authorize_with_policy

  ###
  # @description: Returns the term with id equal to the one passed in params
  ###
  def show
    render json: @term, include: %i[property vocabularies]
  end

  ###
  # @description: Updates a term in conjuntion with its property
  ###
  def update
    @term.update(permitted_params)

    render json: @term, include: :property
  end

  ###
  # @description: Removes a term from the database
  ###
  def destroy
    @term.destroy!

    render json: {status: :removed}
  end

  private

  ###
  # @description: Execute the authorization policy
  ###
  def authorize_with_policy
    authorize term
  end

  ###
  # @description: Get the current model record
  # @return [ActiveRecord]
  ###
  def term
    @term = params[:id].present? ? Term.find(params[:id]) : Term.first
  end

  ###
  # @description: Clean params
  # @return [ActionController::Parameters]
  ###
  def permitted_params
    params.require(:term).permit(
      :name, :uri, :specification_id, {vocabulary_ids: []},
      property_attributes: [
        :source_uri, :uri, :subproperty_of, :value_space, :label, :comment, :range, :path, {domain: []}
      ]
    )
  end
end
