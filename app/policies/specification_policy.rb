# frozen_string_literal: true

###
# @description: Represents the ability that a user has to access
#   specifications.
###
class SpecificationPolicy < ApplicationPolicy
  ###
  # @description: Determines if the user can create an instance of this resource
  # @return [TrueClass]
  ###
  def index?
    # Signed in users
    signed_in?
  end
end
