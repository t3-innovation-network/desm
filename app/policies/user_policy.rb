# frozen_string_literal: true

###
# @description: Represents the ability that a user has to access
#   user records.
###
class UserPolicy < ApplicationPolicy
  def initialize(user, record)
    super(user, record)
    @user = user
    @record = record
    @admin_role_name = Desm::ADMIN_ROLE_NAME.downcase.to_sym

    raise Pundit::NotAuthorizedError unless user&.role?(@admin_role_name)
  end

  ###
  # @description: Determines if the user has access to the index for this resource
  # @return [TrueClass]
  ###
  def index?
    @user.role?(@admin_role_name)
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
