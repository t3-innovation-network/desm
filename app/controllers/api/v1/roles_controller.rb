# frozen_string_literal: true

###
# @description: Place all the actions related to organizations
###
module API
  module V1
    class RolesController < BaseController
      ###
      # @description: Lists all the organizations
      ###
      def index
        @roles = Role.all.order(name: :asc)

        render json: @roles
      end
    end
  end
end
