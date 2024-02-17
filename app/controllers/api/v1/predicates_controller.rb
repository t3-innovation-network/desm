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
        render json: current_configuration_profile.predicates.includes(:predicate_set)
      end
    end
  end
end
