# frozen_string_literal: true

###
# @description: Return Json configuration profiles by slug
###
module Resources
  class SpecificationsController < ApplicationController
    def index
      list = Specification.all.map(&:uri)

      render json: list
    end

    def show
      spec = Specification.find_by_slug!(params[:slug])

      render json: spec.to_json_ld
    end
  end
end
