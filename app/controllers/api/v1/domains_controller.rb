# frozen_string_literal: true

###
# @description: Place all the actions related to domains
###
class Api::V1::DomainsController < ApplicationController
  before_action :authorize_with_policy

  include Pundit

  ###
  # @description: Lists all the domains
  ###
  def index
    @domains = Domain.order(pref_label: :asc)

    render json: @domains
  end

  ###
  # @description: Returns the domain with id equal to the one passed in params
  ###
  def show
    domain = Domain.find(params[:id])
    render json: domain
  end

  private

  ###
  # @description: Execute the authorization policy
  ###
  def authorize_with_policy
    authorize domain
  end

  ###
  # @description: Get the current model record
  # @return [ActiveRecord]
  ###
  def domain
    @domain = params[:id].present? ? Domain.find(params[:id]) : Domain.first
  end
end
