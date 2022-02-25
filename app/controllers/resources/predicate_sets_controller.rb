# frozen_string_literal: true

###
# @description: Return Json predicate sets by slug
###
class Resources::PredicateSetsController < ApplicationController
  def index
    list = PredicateSet.all.map {|ps|
      {
        uri: ps.uri,
        concepts: ps.predicates.map(&:uri).sort
      }
    }

    render json: list
  end

  def show
    set = PredicateSet.find_by_slug!(params[:slug])

    render json: set.to_json_ld
  end
end
