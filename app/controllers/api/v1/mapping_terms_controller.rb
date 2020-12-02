# frozen_string_literal: true

###
# @description: Place all the actions related to mappings
###
class Api::V1::MappingTermsController < ApplicationController
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
      unless params[:mapping_term][:mapped_terms].nil?
        @instance.update_mapped_terms(params[:mapping_term][:mapped_terms])
      end
      @instance.update!(permitted_params)
    end

    render json: @instance, include: %i[mapped_terms]
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
    terms = MappingTerm.joins(:mapping).where(mappings: {status: :mapped})

    terms = terms.where(spine_term_id: params[:spine_term_id]) if params[:spine_term_id].present?

    terms.order(:uri)
  end

  ###
  # @description: Clean params
  # @return [ActionController::Parameters]
  ###
  def permitted_params
    params.require(:mapping_term).permit(:comment, :predicate_id)
  end
end
