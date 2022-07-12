# frozen_string_literal: true

###
# @description: Represents a Concept Scheme, with is a set of predicates
#   (in form of skos concepts) to map to.
#
#   There's a rake task that will feed the domain sets and predicates by
#   reading and parsing each file inside the "ns" directory.
###
class PredicateSet < ApplicationRecord
  include Slugable
  validates :source_uri, presence: true
  validates :title, presence: true
  has_many :predicates
  belongs_to :strongest_match, foreign_key: "strongest_match_id", class_name: "Predicate", optional: true
  alias_attribute :name, :title

  def to_json_ld
    {
      name: title,
      uri: uri,
      source_uri: source_uri,
      description: description,
      created_at: created_at,
      concepts: predicates.map(&:uri).sort
    }
  end
end
