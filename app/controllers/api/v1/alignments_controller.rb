# frozen_string_literal: true

###
# @description: Place all the actions related to mapping alignments
###
class Api::V1::AlignmentsController < ApplicationController
  before_action :authorize_with_policy, except: :index

  ###
  # @description: List of alignments. It can be filtered by passing a list of possible filter
  #   values detailed in filter method
  ###
  def index
    terms = filter

    render json: terms, include: [:spine_term, :predicate, {mapped_terms: {include: :property}}]
  end

  ###
  # @description: Updates a single mapping term, firstly updating its mapped terms
  ###
  def update
    ActiveRecord::Base.transaction do
      @instance.update_mapped_terms(params[:alignment][:mapped_terms]) unless params[:alignment][:mapped_terms].nil?
      @instance.update!(permitted_params)
    end

    render json: @instance, include: %i[mapped_terms]
  end

  ###
  # @description: Removes an alignment from our records
  ###
  def destroy
    @instance.destroy!

    render json: {
      success: true
    }
  end

  private

  ###
  # @description: Execute the authorization policy
  ###
  def authorize_with_policy
    authorize(with_instance)
  end

  ###
  # @description: Applies the filter/s from the params
  # @return [ActiveRecord::Relation]
  ###
  def filter
    terms = Alignment
            .joins(mapping: :configuration_profile)
            .where(
              configuration_profiles: {id: current_configuration_profile},
              mappings: {status: :mapped}
            )

    terms.where!(spine_term_id: params[:spine_term_id]) if params[:spine_term_id].present?

    terms.order(:uri)
  end

  ###
  # @description: Clean params
  # @return [ActionController::Parameters]
  ###
  def permitted_params
    params.require(:alignment).permit(:comment, :predicate_id)
  end
end
