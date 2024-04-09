# frozen_string_literal: true

###
# @description: Represents the ability that a user has to access
#   term records.
###
class AlignmentVocabularyConceptPolicy < ApplicationPolicy
  ###
  # @description: Determines if the user can update an instance of this resource
  # @return [TrueClass]
  ###
  def update?
    signed_in?
  end
end
