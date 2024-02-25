# frozen_string_literal: true

###
# @description: Represents the ability that a user has to access
#   term records.
###
class SpineTermPolicy < ApplicationPolicy
  ###
  # @description: Determines if the user can create an instance of this resource
  # @return [TrueClass]
  ###
  def create?
    # Signed in users
    signed_in?
  end
end
