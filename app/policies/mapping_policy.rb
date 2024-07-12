# frozen_string_literal: true

###
# @description: Represents the ability that a user has to access
#   organization records.
###
class MappingPolicy < ApplicationPolicy
  ###
  # @description: Determines if the user has access to the index for this resource
  # @return [TrueClass]
  ###
  def index?
    # Signed in users
    signed_in?
  end

  ###
  # @description: Determines if the user can see this resource
  # @return [TrueClass]
  ###
  def show?
    # Signed in users
    signed_in?
  end

  ###
  # @description: Determines if the user can see this resource terms
  # @return [TrueClass]
  ###
  def show_terms?
    # Signed in users
    signed_in?
  end

  ###
  # @description: Determines if the user can see this resource selected terms
  # @return [TrueClass]
  ###
  def show_selected_terms?
    # Signed in users
    signed_in?
  end

  ###
  # @description: Determines if the user can create an instance of this resource
  # @return [TrueClass]
  ###
  def create?
    signed_in?
  end

  ###
  # @description: Determines if the user can create an instance of this resource's selected terms
  # @return [TrueClass]
  ###
  def create_selected_terms?
    signed_in?
  end

  ###
  # @description: Determines if the user can remove an instance of this resource
  # @return [TrueClass]
  ###
  def destroy?
    signed_in?
  end

  ###
  # @description: Determines if the user can update an instance of this resource
  # @return [TrueClass]
  ###
  def update?
    signed_in?
  end

  class Scope < ApplicationPolicy::Scope
    def resolve
      return scope.all if user.user.super_admin?

      user.configuration_profile&.mappings || user.user.mappings
    end
  end
end
