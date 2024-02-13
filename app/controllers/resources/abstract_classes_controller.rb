# frozen_string_literal: true

###
# @description: Return Json abstract classes by slug
###
module Resources
  class AbstractClassesController < ApplicationController
    def show
      domain = Domain.find_by_slug!(params[:slug])

      render json: domain.to_json_ld
    end
  end
end
