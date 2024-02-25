# frozen_string_literal: true

###
# @description: Represents the ability that a user has to access
#   term records.
###
class TermPolicy < ApplicationPolicy
  ###
  # @description: Determines if the user can see this resource
  # @return [TrueClass]
  ###
  def show?
    # Signed in users
    signed_in?
  end

  ###
  # @description: Determines if the user can update an instance of this resource
  # @return [TrueClass]
  ###
  def update?
    signed_in?
  end

  ###
  # @description: Determines if the user can destroy an instance of this resource
  # @return [TrueClass]
  ###
  def destroy?
    signed_in?
  end

  ###
  # @description: Determines if the user can list all the terms from a specific specification
  # @return [TrueClass]
  ###
  def index?
    signed_in?
  end
end
