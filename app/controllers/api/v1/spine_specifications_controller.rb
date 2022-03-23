# frozen_string_literal: true

###
# @description: Place all the actions related to spine specifications
###
class Api::V1::SpineSpecificationsController < ApplicationController
  before_action :authorize_with_policy
  before_action :instantiate_spines, only: :index

  ###
  # @description: Returns a filtered list of specifications for an organization
  ###
  def index
    filter

    render json: @spines
  end

  private

  ###
  # @description: Execute the authorization policy
  ###
  def authorize_with_policy
    authorize(with_instance(Specification))
  end

  ###
  # @description: Get the list of spine specifications for the user's organization
  # @return [Array]:
  ###
  def instantiate_spines
    @spines = Domain.all.filter_map {|d| d.spine if d.spine? }
  end

  ###
  # @description: Applies the filter/s from the params
  # @return [Array]
  ###
  def filter
    # Filter by current user if requested
    unless params[:filter].eql?("all")
      @spines = @spines.filter_map {|s|
        s if s.mappings.any? {|m| m&.user.eql?(current_user) }
      }
    end

    @spines.sort_by(&:name)
  end
end
