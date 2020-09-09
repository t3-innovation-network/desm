# frozen_string_literal: true

###
# @description: Represents a mapping term, which is each of terms resulting of
#   a merge between 2 specifications.
#
#   It's created when the user uploads a specification for a domain which
#   already has a spine (a previous specification was uploaded for it).
###
class MappingTerm < ApplicationRecord
  belongs_to :mapping
  belongs_to :predicate
  has_one :spine_term, foreign_key: "spine_term_id", class_name: "Term"
  has_one :mapped_term, foreign_key: "mapped_term_id", class_name: "Term"

  validates :uri, presence: true
end
