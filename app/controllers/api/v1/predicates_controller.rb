# frozen_string_literal: true

###
# @description: Place all the actions related to predicates
###
class API::V1::PredicatesController < ApplicationController
  ###
  # @description: Lists all the predicates
  ###
  def index
    render json: current_configuration_profile.predicates
  end
end
