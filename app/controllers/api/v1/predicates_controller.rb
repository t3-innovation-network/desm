# frozen_string_literal: true

###
# @description: Place all the actions related to predicates
###
class Api::V1::PredicatesController < ApplicationController
  ###
  # @description: Lists all the predicates
  ###
  def index
    predicates = Predicate.all.order(:pref_label)

    render json: predicates
  end
end
