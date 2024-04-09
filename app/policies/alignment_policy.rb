# frozen_string_literal: true

###
# @description: Represents the ability that a user has to access
#   organization records.
###
class AlignmentPolicy < ApplicationPolicy
  ###
  # @description: Determines if the user can update an instance of this resource
  # @return [TrueClass]
  ###
  def update?
    signed_in?
  end

  ###
  # @description: Determines if the user can remove an instance of this resource
  # @return [TrueClass]
  ###
  def destroy?
    signed_in?
  end
end
