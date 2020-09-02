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

    render json: {domains: domains}
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
end
