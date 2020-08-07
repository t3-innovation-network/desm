# frozen_string_literal: true

###
# @description: Represents the ability that a user has to access
#   organization records.
###
class OrganizationPolicy < ApplicationPolicy
  def initialize(user, organization)
    @user = user
    @organization = organization
    @admin_role_name = (ENV["ADMIN_ROLE_NAME"] || "Admin").downcase.to_sym

    raise Pundit::NotAuthorizedError unless user&.role?(@admin_role_name)
  end

  ###
  # @description: Determines if the user has access to the index for this resource
  # @return [TrueClass]
  ###
  def index?
    user.role?(@admin_role_name)
  end

  ###
  # @description: Determines if the user can see this resource
  # @return [TrueClass]
  ###
  def show?
    user.role?(@admin_role_name)
  end

  ###
  # @description: Determines if the user can create an instance of this resource
  # @return [TrueClass]
  ###
  def create?
    user.role?(@admin_role_name)
  end

  ###
  # @description: Determines if the user can update an instance of this resource
  # @return [TrueClass]
  ###
  def update?
    user.role?(@admin_role_name)
  end

  ###
  # @description: Determines if the user can destroy an instance of this resource
  # @return [TrueClass]
  ###
  def destroy?
    user.role?(@admin_role_name)
  end
end
