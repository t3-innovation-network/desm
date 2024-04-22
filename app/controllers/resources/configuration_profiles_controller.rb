# frozen_string_literal: true

###
# @description: Return Json configuration profiles by slug
###
module Resources
  class ConfigurationProfilesController < ApplicationController
    include Decodable

    def index
      list = ConfigurationProfile.all.map(&:uri).sort

      render json: list
    end

    def show
      cp = ConfigurationProfile.find_by_slug!(decoded_slug)

      render json: cp.structure
    end
  end
end
