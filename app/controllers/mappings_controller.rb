# frozen_string_literal: true

###
# @description This controller holds all the actions related to the mappings.
#   As an example, when a user wants to start making a mapping, it will show
#   the "Start Mapping" view to the user
###
class MappingsController < ApplicationController
  # Prepare data for the the "Start Mapping" view and redirect to it
  def index
    @current_page = t("mapping.map_specification")

    @specifications = Specification.all
    @domains = Domain.all.sort_by(&:name)
  end
end
