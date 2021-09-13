# frozen_string_literal: true

###
# @description: Represents a Concept Scheme, with is a set of predicates
#   (in form of skos concepts) to map to.
#
#   There's a rake task that will feed the domain sets and predicates by
#   reading and parsing each file inside the "ns" directory.
###
class PredicateSet < ApplicationRecord
  validates :uri, presence: true, uniqueness: true
  validates :title, presence: true
  has_many :predicates
end
