# frozen_string_literal: true

# == Schema Information
#
# Table name: domain_sets
#
#  id          :bigint           not null, primary key
#  creator     :string
#  description :text
#  slug        :string
#  source_uri  :string           not null
#  title       :string           not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#
# Indexes
#
#  index_domain_sets_on_source_uri  (source_uri)
#

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
  audited

  validates :source_uri, presence: true
  validates :title, presence: true
  has_one :configuration_profile
  has_many :domains
  ALIAS_CLASSNAME = "AbstractClassSet"
  alias_attribute :name, :title

  def to_json_ld
    {
      name: title,
      uri:,
      source_uri:,
      description:,
      created_at:,
      domains: domains.map(&:to_json_ld)
    }
  end
end
