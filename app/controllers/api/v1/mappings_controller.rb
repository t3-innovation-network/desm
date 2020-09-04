# frozen_string_literal: true

###
# @description: Place all the actions related to mappings
###
class Api::V1::MappingsController < ApplicationController
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
    mapping = Mapping.find(params[:id])
    render json: mapping, include: :specification
  end
end
