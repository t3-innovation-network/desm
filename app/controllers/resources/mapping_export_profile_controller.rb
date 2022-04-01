# frozen_string_literal: true

###
# @description: Return Json abstract classes by slug
###
class Resources::MappingExportProfileController < ApplicationController
  def show
    domain = Domain.find_by_slug!(params[:slug])

    render json: domain.mapping_export_profile
  end
end
