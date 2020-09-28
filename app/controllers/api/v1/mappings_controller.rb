# frozen_string_literal: true

###
# @description: Place all the actions related to mappings
###
class Api::V1::MappingsController < ApplicationController
  before_action :authorize_with_policy

  ###
  # @description: Lists all the mappings for the current user's organization
  ###
  def index
    mappings = filter

    render json: mappings, include: {specification: {include: %i[user terms]}}
  end

  ###
  # @description: Create a mapping with its related specification
  ###
  def create
    spec = Specification.find(params[:specification_id])

    # Proceed to create the mapping if this is not the spine
    mapping = Processors::Mappings.create(spec, current_user) unless spec.spine?

    render json: mapping, include: :specification
  end

  ###
  # @description: Fetch the mapping with the id equal to the one passed
  #   in params
  ###
  def show
    render json: @mapping, include: {specification: {include: {terms: {include: :property}}}}
  end

  private

  ###
  # @description: Execute the authorization policy
  ###
  def authorize_with_policy
    authorize mapping
  end

  ###
  # @description: Get the current model record
  # @return [ActiveRecord]
  ###
  def mapping
    @mapping = params[:id].present? ? Mapping.find(params[:id]) : Mapping.new
  end

  ###
  # @description: Applies the filter/s from the params
  # @return [ActiveRecord::Relation]
  ###
  def filter
    # Always show only the mappings for the current user's organization
    mappings = Mapping.where(user: current_user.organization.users)

    # Filter by current user
    mappings = mappings.where(user: current_user) if params[:user].present? && params[:user] != "all"

    # Return an ordered list
    mappings.order(title: :desc)
  end
end
