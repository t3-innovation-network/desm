# frozen_string_literal: true

###
# @description: Place all the actions related to organizations
###
class API::V1::RolesController < ApplicationController
  ###
  # @description: Lists all the organizations
  ###
  def index
    @roles = Role.all.order(name: :asc)

    render json: @roles
  end
end
