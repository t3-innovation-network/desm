# frozen_string_literal: true

###
# @description: Represents the ability that a user has to access
#   organization records.
###
class OrganizationPolicy < ApplicationPolicy
  def initialize(user, record)
    @user = user || @current_user
    @record = record

    # Signed in users
    raise Pundit::NotAuthorizedError unless user.present?
  end

  ###
  # @description: Determines if the user can see this resource
  # @return [TrueClass]
  ###
  def show?
    @user.role?(@admin_role_name)
  end

  ###
  # @description: Determines if the user can create an instance of this resource
  # @return [TrueClass]
  ###
  def create?
    @user.role?(@admin_role_name)
  end

  ###
  # @description: Determines if the user can update an instance of this resource
  # @return [TrueClass]
  ###
  def update?
    @user.role?(@admin_role_name)
  end

  ###
  # @description: Determines if the user can destroy an instance of this resource
  # @return [TrueClass]
  ###
  def destroy?
    @user.role?(@admin_role_name)
  end
end
