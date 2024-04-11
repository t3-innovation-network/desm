# frozen_string_literal: true

###
# @description: Place all the actions related to predicates
###
module API
  module V1
    class PredicatesController < BaseController
      ###
      # @description: Lists all the predicates
      ###
      def index
        raise Pundit::NotAuthorizedError, "configuration profile need to be chosen" \
         unless current_configuration_profile.present?

        render json: current_configuration_profile.predicates.includes(:predicate_set)
      end
    end
  end
end
