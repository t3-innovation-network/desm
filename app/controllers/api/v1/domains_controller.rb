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
    domains = current_user&.available_domains || DomainSet.first.domains
    render json: domains.includes(:spine)
  end

  ###
  # @description: Returns the domain with id equal to the one passed in params
  ###
  def show
    render json: @instance
  end
end
