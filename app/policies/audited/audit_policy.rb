# frozen_string_literal: true

###
# @description: Represents the ability that a user has to access
#   term records.
###
module Audited
  class AuditPolicy < ApplicationPolicy
    ###
    # @description: Determines if the user can see this resource's list
    # @return [TrueClass]
    ###
    def index?
      # Signed in users
      signed_in?
    end
  end
end
