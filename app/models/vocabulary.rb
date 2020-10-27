# frozen_string_literal: true

###
# @description: Represents a vocabularie to be used in a term for
#   a specification.
#   - A term can have many vocabularies associated. And a vocabulary
#   may be in use by many terms.
#   - A vocabulary will specify the meanings for a term definition.
#   The implementation will be all in the content attribute as a Hash.
###
class Vocabulary < ApplicationRecord
  belongs_to :organization
  has_and_belongs_to_many :terms

  validates :name, presence: true, uniqueness: {scope: :organization_id}

  ###
  # @description: Returns the collection of concepts
  # @return [Array]: The collection of concepts
  ###
  def concepts
    concepts = content["@graph"]
               .select {|concept| concept["type"].downcase == "skos:concept" }

    concepts.map {|elem|
      {
        id: elem["id"],
        name: elem["prefLabel"]["en-us"],
        definition: elem["definition"]["en-us"]
      }
    }
  end

  ###
  # @description: Include additional information about the specification in
  #   json responses. This overrides the ApplicationRecord as_json method.
  ###
  def as_json(options={})
    super options.merge(methods: %i[concepts])
  end
end
