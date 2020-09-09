# frozen_string_literal: true

###
# @description: Represents a property of a term in a specification
#   uploaded by a user
###
class Property < ApplicationRecord
  belongs_to :term
  validates :uri, presence: true, uniqueness: true
end
