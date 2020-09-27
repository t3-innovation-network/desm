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
end
