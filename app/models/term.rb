# frozen_string_literal: true

###
# @description: Represents a node of a specification
###
class Term < ApplicationRecord
  belongs_to :specification
  has_one :property, dependent: :destroy
  has_and_belongs_to_many :vocabularies

  validates :uri, presence: true

  accepts_nested_attributes_for :property, allow_destroy: true
end
