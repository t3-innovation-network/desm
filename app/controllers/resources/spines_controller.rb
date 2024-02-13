# frozen_string_literal: true

###
# @description: Return Json configuration profiles by slug
###
module Resources
  class SpinesController < ApplicationController
    def index
      list = Spine.all.map(&:uri)

      render json: list
    end

    def show
      spec = Spine.find_by_slug!(params[:slug])

      render json: spec.to_json_ld
    end
  end
end
