# frozen_string_literal: true

###
# @description: This module defines methods for models that are
#   related to organizations
###
module Organizationable
  extend ActiveSupport::Concern

  included do
    ###
    # @description: Filter the model by organization
    ###
    scope :for_organization, lambda {|organization|
                               where(organization: organization)
                             }
  end
end
