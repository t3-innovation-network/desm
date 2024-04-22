# frozen_string_literal: true

###
# @description: Represents the ability that only admin can acess the data
###
class AdminAccessPolicy < ApplicationPolicy
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

  class Scope < ApplicationPolicy::Scope
    def resolve
      return scope.all if user.user.super_admin?

      scope.none
    end
  end
end
