# frozen_string_literal: true

###
# @description: Represents the ability that a user has to access
#   term records.
###
module Audited
  class AuditPolicy < ApplicationPolicy
    def initialize(user, record)
      @user = user || @current_user
      @record = record

      # Signed in users
      raise Pundit::NotAuthorizedError unless user.present?
    end

    ###
    # @description: Determines if the user can see this resource's list
    # @return [TrueClass]
    ###
    def index?
      # Signed in users
      @user.present?
    end
  end
end
