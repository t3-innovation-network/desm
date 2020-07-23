# frozen_string_literal: true

###
# @description: Place all the actions related to companies
###
class Admin::CompaniesController < ApplicationController
  # We use a different template for this controller, in order the make a
  # difference between the public and the restricted html templates
  layout "admin"
  before_action :authorize_with_policy

  include Pundit

  ###
  # @description: List all the companies
  ###
  def index
    @companies = Company.all
  end

  private

  ###
  # @description: Execute the authorization policy
  ###
  def authorize_with_policy
    authorize company
  end

  ###
  # @description: Get the current model record
  # @return [ActiveRecord]
  ###
  def company
    @company || params[:id].present? ? Company.find(params[:id]) : Company.first
  end
end
