# frozen_string_literal: true

###
# @description: Place all the actions related to spine specifications
###
module API
  module V1
    class SpineSpecificationsController < BaseController
      ###
      # @description: Returns a filtered list of specifications for an organization
      ###
      def index
        render json: current_configuration_profile.spines, include: %i(domain)
      end

      def show
        spine = Spine.find(params[:id])
        render json: spine, include: %i(domain)
      end
    end
  end
end
