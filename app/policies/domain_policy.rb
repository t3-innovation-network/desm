# frozen_string_literal: true

###
# @description: Represents the ability that a user has to access
#   organization records.
###
class DomainPolicy < ApplicationPolicy
  def initialize(user, record)
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
  # @description: Determines if the user can see this resource
  # @return [TrueClass]
  ###
  def show?
    # Signed in users
    @user.present?
  end
end