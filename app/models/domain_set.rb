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
  validates :uri, presence: true, uniqueness: true
  validates :title, presence: true
  has_many :domains
end
