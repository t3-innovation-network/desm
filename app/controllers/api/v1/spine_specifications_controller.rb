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

    render json: @specs
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
    @specs = begin
      if current_user.super_admin?
        Domain.all.filter_map(&:spine)
      else
        Domain.where.not(spine_id: nil)
              .filter_map(&:spine)
              .select {|spec|
          current_user.organization.users.map(&:id).include?(spec.user_id)
        }
      end
    end
  end

  ###
  # @description: Applies the filter/s from the params
  # @return [Array]
  ###
  def filter
    # Filter by current user if requested
    @specs = @specs.select {|spec| spec&.user.eql?(current_user) } if params[:filter] != "all"

    # Return an ordered list
    @specs.sort_by(&:name)
  end
end
