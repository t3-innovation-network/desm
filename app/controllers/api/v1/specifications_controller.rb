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
end
