# frozen_string_literal: true

###
# @description: Return Json predicate sets by slug
###
module Resources
  class PredicateSetsController < ApplicationController
    include Decodable

    def index
      list = PredicateSet.all.map do |ps|
        {
          uri: ps.uri,
          concepts: ps.predicates.map(&:uri).sort
        }
      end

      render json: list
    end

    def show
      set = PredicateSet.find_by_slug!(decoded_slug)

      render json: set.to_json_ld
    end
  end
end
