# frozen_string_literal: true

###
# @description: Place all the actions related to domains
###
module API
  module V1
    class DomainsController < BaseController
      before_action :with_instance, only: :show

      ###
      # @description: Lists all the domains
      ###
      def index
        raise Pundit::NotAuthorizedError, "configuration profile need to be chosen" \
         unless current_configuration_profile.present?

        render json: current_configuration_profile.domains.includes(:spine)
      end

      ###
      # @description: Returns the domain with id equal to the one passed in params
      ###
      def show
        render json: @instance
      end
    end
  end
end
