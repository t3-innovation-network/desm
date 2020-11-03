# frozen_string_literal: true

###
# @description: Place all the actions related to domains
###
class Api::V1::DomainsController < ApplicationController
  before_action :authorize_with_policy

  ###
  # @description: Lists all the domains
  ###
  def index
    domains = Domain.order(pref_label: :asc)

    render json: domains
  end

  ###
  # @description: Returns the domain with id equal to the one passed in params
  ###
  def show
    render json: @instance
  end

  private

  ###
  # @description: Execute the authorization policy
  ###
  def authorize_with_policy
    authorize(with_instance)
  end
end
