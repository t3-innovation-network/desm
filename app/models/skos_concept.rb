# frozen_string_literal: true

# == Schema Information
#
# Table name: skos_concepts
#
#  id  :bigint           not null, primary key
#  raw :jsonb            not null
#  uri :string           not null
#
# Indexes
#
#  index_skos_concepts_on_uri  (uri) UNIQUE
#

###
# @description: Represents an skos concept, which is an element composing a vocabulary
#   This is a representation of a node inside a vocabualry graph
###
class SkosConcept < ApplicationRecord
  ###
  # @description: The vocabulary where this concept belongs
  ###
  has_and_belongs_to_many :vocabularies

  ###
  # @description: The raw representation of this concept.
  ###
  validates :raw, presence: true

  ###
  # @description: The unique uri for this concept
  ###
  validates :uri, presence: true, uniqueness: true
end
