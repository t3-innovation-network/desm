# frozen_string_literal: true

###
# @description: Represents the ability that a user has to access
#   organization records.
###
class MappingPolicy < ApplicationPolicy
  def initialize(user, record)
    super(user, record)
    @user = user || @current_user
    @record = record

    # Signed in users
    raise Pundit::NotAuthorizedError unless user.present?
  end

  ###
  # @description: Determines if the user has access to the index for this resource
  # @return [TrueClass]
  ###
  def index?
    # Signed in users
    @user.present?
  end

  ###
  # @description: Determines if the user can export this resource
  # @return [TrueClass]
  ###
  def export?
    # Signed in users
    @user.present?
  end

  ###
  # @description: Determines if the user can see this resource
  # @return [TrueClass]
  ###
  def show?
    # Signed in users
    @user.present?
  end

  ###
  # @description: Determines if the user can see this resource terms
  # @return [TrueClass]
  ###
  def show_terms?
    # Signed in users
    @user.present?
  end

  ###
  # @description: Determines if the user can see this resource selected terms
  # @return [TrueClass]
  ###
  def show_selected_terms?
    # Signed in users
    @user.present?
  end

  ###
  # @description: Determines if the user can create an instance of this resource
  # @return [TrueClass]
  ###
  def create?
    @user.present?
  end

  ###
  # @description: Determines if the user can create an instance of this resource's selected terms
  # @return [TrueClass]
  ###
  def create_selected_terms?
    @user.present?
  end

  ###
  # @description: Determines if the user can remove an instance of this resource
  # @return [TrueClass]
  ###
  def destroy?
    @user.present?
  end

  ###
  # @description: Determines if the user can update an instance of this resource
  # @return [TrueClass]
  ###
  def update?
    @user.present?
  end

  class Scope < ApplicationPolicy::Scope
    def resolve
      return scope.all if user.super_admin?

      user.mappings
    end
  end
end
