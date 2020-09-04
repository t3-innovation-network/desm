# frozen_string_literal: true

###
# @description: Represents a node of a specification
###
class Term < ApplicationRecord
  belongs_to :specification
  has_one :property

  validates :uri, presence: true
end
