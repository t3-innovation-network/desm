# frozen_string_literal: true

###
# @description: Place all the actions related to predicates
###
class Api::V1::PredicatesController < ApplicationController
  ###
  # @description: Lists all the predicates
  ###
  def index
    render json: current_user&.available_predicates || PredicateSet.first.predicates
  end
end
