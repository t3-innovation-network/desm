# frozen_string_literal: true

###
# @description: Represents the ability that a user has to access
#   user records.
###
class UserPolicy < ApplicationPolicy
  def initialize(user, record)
    @user = user
    @record = record
    raise Pundit::NotAuthorizedError unless user.role?(:admin)
  end

  ###
  # @description: Determines if the user has access to the index for this resource
  # @return [TrueClass]
  ###
  def index?
    user.role?(:admin)
  end

  ###
  # @description: Determines if the user can see this resource
  # @return [TrueClass]
  ###
  def show?
    user.role?(:admin)
  end

  ###
  # @description: Determines if the user can create an instance of this resource
  # @return [TrueClass]
  ###
  def create?
    user.role?(:admin)
  end

  ###
  # @description: Determines if the user has access to the new? method for this resource
  # @return [TrueClass]
  ###
  def new?
    create?
  end

  ###
  # @description: Determines if the user can update an instance of this resource
  # @return [TrueClass]
  ###
  def update?
    user.role?(:admin)
  end

  ###
  # @description: Determines if the user can update an instance of this resource (see the edit page)
  # @return [TrueClass]
  ###
  def edit?
    update?
  end

  ###
  # @description: Determines if the user can destroy an instance of this resource
  # @return [TrueClass]
  ###
  def destroy?
    user.role?(:admin)
  end
end
