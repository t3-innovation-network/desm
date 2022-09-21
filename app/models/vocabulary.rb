# frozen_string_literal: true

###
# @description: Represents a vocabulary to be used in a term for
#   a specification.
#   - A term can have many vocabularies associated. And a vocabulary
#   may be in use by many terms.
#   - A vocabulary will specify the meanings for a term definition.
#   The implementation will be all in the content attribute as a Hash.
###
class Vocabulary < ApplicationRecord
  ###
  # @description: The configuration profile and user this vocabulary belongs to
  ###
  belongs_to :configuration_profile

  ###
  # @description: The specification terms that are related to this vocabulary
  ###
  has_and_belongs_to_many :terms

  ###
  # @description: The concepts this vocabulary contains, it's modeled like a many-to-many
  #   relationship, because it's a graph, so a vocabulary may contain many concepts, and
  #   concepts can be found in many vocabularies either.
  ###
  has_and_belongs_to_many :concepts, class_name: "SkosConcept"
end
