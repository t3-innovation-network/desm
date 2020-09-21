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
  include Organizationable

  belongs_to :organization
  has_and_belongs_to_many :terms

  before_save :name_taken?

  validates :name, presence: true

  ###
  # @description: Validates the name was not taken within the organization
  # @return [TrueClass|FalseClass]:
  ###
  def name_taken?
    if self.class
           .for_organization(organization)
           .where(name: name)
           .count.positive?
      raise ActiveRecord::RecordNotUnique.new(
        "Vocabulary name already taken"
      )
    end
  end
end
