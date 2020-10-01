# frozen_string_literal: true

###
# @description: Represents a mapping, which is the concept of the merge
#   between 2 specifications.
#
#   It's created when the user uploads a specification for a domain which
#   already has a spine (a previous specification was uploaded for it).
###
class Mapping < ApplicationRecord
  belongs_to :user
  belongs_to :specification
  belongs_to :spine, foreign_key: "spine_id", class_name: :Specification
  has_many :terms, class_name: :MappingTerm
  validates :name, presence: true
end
