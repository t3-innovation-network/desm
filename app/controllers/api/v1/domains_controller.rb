# frozen_string_literal: true

###
# @description: Place all the actions related to domains
###
class Api::V1::DomainsController < ApplicationController
  before_action :with_instance, only: :show

  ###
  # @description: Lists all the domains
  ###
  def index
    render json: current_user.available_domains
  end

  ###
  # @description: Returns the domain with id equal to the one passed in params
  ###
  def show
    render json: @instance
  end
end
