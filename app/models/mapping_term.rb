# frozen_string_literal: true

###
# @description: Represents a mapping term, which is each of terms resulting of
#   a merge between 2 specifications.
#
#   It's created when the user selects a term from the specification to map
#   against the spine.
###
class MappingTerm < ApplicationRecord
  belongs_to :mapping
  belongs_to :predicate, optional: true
  belongs_to :spine_term, foreign_key: "spine_term_id", class_name: "Term", optional: true
  has_and_belongs_to_many :mapped_terms, join_table: :mapping_term_mapped_terms, class_name: :Term

  validates :uri, presence: true
end
