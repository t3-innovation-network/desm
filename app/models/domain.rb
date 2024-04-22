# frozen_string_literal: true

# == Schema Information
#
# Table name: domains
#
#  id            :bigint           not null, primary key
#  definition    :text
#  pref_label    :string           not null
#  slug          :string
#  source_uri    :string           not null
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  domain_set_id :bigint           not null
#
# Indexes
#
#  index_domains_on_domain_set_id                 (domain_set_id)
#  index_domains_on_domain_set_id_and_pref_label  (domain_set_id,pref_label) UNIQUE
#  index_domains_on_domain_set_id_and_source_uri  (domain_set_id,source_uri) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (domain_set_id => domain_sets.id) ON DELETE => cascade
#

###
# @description: Represents a Concept, which is a domain from a Concept Scheme
#   (also refered to as 'domain set'.
#
#   These concepts or domains are the entities related to the specifications
#   trhre users uploads. In other words, a specification must be only for one
#   domain, e.g.:
#
#   - Organization
#   - Person
#   - Course
#
#   These domains are, belongs to the "Desm Concept Scheme", which is a domain
#   set.
###
class Domain < ApplicationRecord
  include Slugable
  audited

  ALIAS_CLASSNAME = "AbstractClass"
  belongs_to :domain_set
  has_one :spine, dependent: :destroy
  has_one :configuration_profile, through: :domain_set
  validates :source_uri, presence: true, uniqueness: { scope: :domain_set_id }
  validates :pref_label, presence: true, uniqueness: { scope: :domain_set_id }
  alias_attribute :name, :pref_label

  ###
  # @description: Return whether a domain has a designated spine. Automatically assigned when uploading a specification
  #  or at configuration profile stage when configuring the related abstract class for a schema.
  # @return [TrueClass|FalseClass]
  ###
  def spine?
    !spine.nil?
  end

  def as_json(options = {})
    super(options.merge(methods: %i(spine? spine)))
  end

  def to_json_ld
    json = {
      uri:,
      source_uri:,
      pref_label:,
      definition:
    }
    json[:spine] = spine.uri if spine?

    json
  end

  def mapping_export_profile
    Exporters::MappingExportProfile.new(self).export
  end
end
