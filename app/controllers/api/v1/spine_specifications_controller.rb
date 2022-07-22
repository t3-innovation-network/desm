# frozen_string_literal: true

###
# @description: Place all the actions related to spine specifications
###
class Api::V1::SpineSpecificationsController < ApplicationController
  before_action :authorize_with_policy

  ###
  # @description: Returns a filtered list of specifications for an organization
  ###
  def index
    render json: current_configuration_profile.spines
  end

  private

  ###
  # @description: Execute the authorization policy
  ###
  def authorize_with_policy
    authorize(with_instance(Specification))
  end
end
