# frozen_string_literal: true

###
# @description: Return Json predicates by slug
###
module Resources
  class PredicatesController < ApplicationController
    include Decodable

    def show
      predicate = Predicate.find_by_slug!(decoded_slug)

      render json: predicate.to_json_ld
    end
  end
end
