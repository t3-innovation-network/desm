# frozen_string_literal: true

###
# @description: Return Json organizations by slug
###
module Resources
  class OrganizationsController < ApplicationController
    def index
      list = Organization.all.map(&:uri).sort

      render json: list
    end

    def show
      organization = Organization.find_by_slug!(params[:slug])

      render json: organization.to_json_ld
    end
  end
end
