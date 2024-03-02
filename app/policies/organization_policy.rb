# frozen_string_literal: true

###
# @description: Represents the ability that a user has to access
#   organization records.
###
class OrganizationPolicy < ApplicationPolicy
  ###
  # @description: Determines if the user can see this resource
  # @return [TrueClass]
  ###
  def show?
    signed_in? && admin_role?
  end

  ###
  # @description: Determines if the user can create an instance of this resource
  # @return [TrueClass]
  ###
  def create?
    signed_in? && admin_role?
  end

  ###
  # @description: Determines if the user can update an instance of this resource
  # @return [TrueClass]
  ###
  def update?
    signed_in? && admin_role?
  end

  ###
  # @description: Determines if the user can destroy an instance of this resource
  # @return [TrueClass]
  ###
  def destroy?
    signed_in? && admin_role?
  end
end
