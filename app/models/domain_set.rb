# frozen_string_literal: true

###
# @description: Represents a Concept Scheme, which is a set of domains
#   (or concepts) to map to.
#
#   In the mapping process, at the beginnig, the user can pick which
#   to map to. In a first use, the application will have only 1 set
#   of domains, but It's also possible to have more than one set of
#   domains by placing different skos files inside the 'ns' directory
#
#   There's a rake task that will feed the domain sets and domains by
#   reading and parsing each file inside the mentioned directory.
###
class DomainSet < ApplicationRecord
  include Slugable
  validates :source_uri, presence: true, uniqueness: true
  validates :title, presence: true
  has_many :domains
  ALIAS_CLASSNAME = "AbstractClassSet"
  alias_attribute :name, :title

  def to_json_ld
    {
      name: title,
      uri: uri,
      source_uri: source_uri,
      description: description,
      created_at: created_at,
      concepts: domains.map(&:uri).sort
    }
  end
end
