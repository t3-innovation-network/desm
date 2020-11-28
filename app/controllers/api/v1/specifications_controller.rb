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
    domains = Processors::Specifications.process_domains_from_file(params[:file])

    render json: domains
  end

  ###
  # @description: Return a json-ld file with the context and a graph
  #  node with only one class, all it's properties and recursively, all the
  #  related properties
  ###
  def filter
    render json: Processors::Specifications.filter_specification(params[:file], params[:uris])
  end

  ###
  # @description: Merge 2 or more files to get a big json-ld graph with all the nodes.
  #   This, in order to ease the frontend and backend working with multiple files.
  ###
  def merge
    files = params[:files].map {|file| Parsers::FormatConverter.convert_to_jsonld(file) }

    render json: Parsers::Specifications.merge_specs(files)
  end

  ###
  # @description: Create a specification with its terms. Store it from an already
  #   filtered JSON object
  ###
  def create
    # Process the file
    spec = Processors::Specifications.create(valid_params)

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
    # We assume we received one only file with all the data
    unified_spec_data = params[:specification][:content]

    permitted_params.merge(
      user: current_user,
      domain_id: params[:specification][:domain_id],
      spec: unified_spec_data
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
