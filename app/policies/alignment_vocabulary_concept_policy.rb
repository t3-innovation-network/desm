# frozen_string_literal: true

###
# @description: Represents the ability that a user has to access
#   term records.
###
class AlignmentVocabularyConceptPolicy < ApplicationPolicy
  def initialize(user, record)
    @user = user || @current_user
    @record = record

    # Signed in users
    raise Pundit::NotAuthorizedError unless user.present?
  end

  ###
  # @description: Determines if the user can update an instance of this resource
  # @return [TrueClass]
  ###
  def update?
    @user.present?
  end
end
