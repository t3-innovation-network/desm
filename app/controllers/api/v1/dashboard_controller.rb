# frozen_string_literal: true

module API
  module V1
    class DashboardController < BaseController
      include AuthAdmin

      def index
        stats = DashboardStatsQuery.call(current_user)
        states = [{ id: "all", name: "All" }].concat(ConfigurationProfile.states_for_select)
        render json: { stats:, states: }
      end
    end
  end
end
