# frozen_string_literal: true

###
# @description: Return Json abstract classes by slug
###
module Resources
  class MappingExportProfileController < BaseController
    before_action :authorize_with_policy
    include Decodable
    include NestedInConfigurationProfile

    def show
      domain = policy_scope(Domain).find_by_slug!(decoded_slug)

      render json: domain.mapping_export_profile
    end

    private

    def authorize_with_policy
      authorize(Domain)
    end
  end
end
