# frozen_string_literal: true

###
# @description: Represents a node of a specification
###
class Term < ApplicationRecord
  belongs_to :specification
  has_one :property, dependent: :destroy

  validates :uri, presence: true

  accepts_nested_attributes_for :property, allow_destroy: true
end
