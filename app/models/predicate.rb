# frozen_string_literal: true

###
# @description: Represents a Predicate, which is a way to identify the nature / quality
# of the mapping between the spine term and mapped term.
#
# E.g.:
#   - "Identical",
#   - "Reworded",
#   - "Agreggated",
#   - "Dissagreggated",
#   - "Intent",
#   - "Concept",
#   - "No Match",
#   - "Not Applicable",
###
class Predicate < ApplicationRecord
  validates :uri, presence: true, uniqueness: true
  validates :pref_label, presence: true
end
