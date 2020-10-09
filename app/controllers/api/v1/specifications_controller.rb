# frozen_string_literal: true

###
# @description: Place all the actions related to specifications
###
class Api::V1::SpecificationsController < ApplicationController
  ###
  # @description: Process a specification file to organiza and return
  #   the related information, like how many domains it contains
  ###
  def info
    file = File.read(params[:file])
    domains = Processors::Specifications.process_domains_from_file(file)

    render json: domains
  end

  ###
  # @description: Return a json-ld file with the context and a graph
  #  node with only one class, all it's properties and recursively, all the
  #  related properties
  ###
  def filter
    file = File.read(params[:file])
    render json: Processors::Specifications.filter_specification(file, params[:uri])
  end

  ###
  # @description: Create a specification with its terms. Store it from an already
  #   filtered JSON object
  ###
  def create
    spec = Processors::Specifications.create(valid_params)

    # If there's no specification for the user's company and the selected domain to
    # map to, then it's the spine.
    spec.spine! unless spec.domain.spine?

    render json: spec
  end

  ###
  # @description: Returns the specification with id equal to the one passed in params
  ###
  def show
    @specification = Specification.find(params[:id])

    render json: @specification, include: %i[user domain]
  end

  private

  ###
  # @description: Clean the parameters with all needed for specifications creation
  # @return [ActionController::Parameters]
  ###
  def valid_params
    permitted_params.merge(
      user: current_user,
      domain_to: params[:domain_to],
      specs: params[:specifications]
    )
  end

  ###
  # @description: Clean params
  # @return [ActionController::Parameters]
  ###
  def permitted_params
    params.require(:specification).permit(:name, :version, :uri, :use_case)
  end
end
