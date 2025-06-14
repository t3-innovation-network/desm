# frozen_string_literal: true

###
# @description: Represents the ability that a user has to access
#   vocabulary records.
###
class VocabularyPolicy < ApplicationPolicy
  ###
  # @description: Determines if the user can see this resource list
  # @return [TrueClass]
  ###
  def index?
    # Signed in users
    signed_in?
  end

  def concepts?
    signed_in?
  end

  ###
  # @description: Determines if the user can create an instance of this resource
  # @return [TrueClass]
  ###
  def create?
    signed_in?
  end

  def predicates?
    signed_in?
  end

  ###
  # @description: Determines if the user can see this resource
  # @return [TrueClass]
  ###
  def show?
    signed_in?
  end

  ###
  # @description: Determines if the user can see this resource
  # @return [TrueClass]
  ###
  def flat?
    signed_in?
  end

  def extract?
    signed_in?
  end

  def spine_term?
    signed_in?
  end
end
