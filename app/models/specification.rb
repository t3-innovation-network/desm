# frozen_string_literal: true

# == Schema Information
#
# Table name: specifications
#
#  id                            :bigint           not null, primary key
#  name                          :string           not null
#  selected_domains_from_file    :jsonb
#  slug                          :string
#  use_case                      :string
#  version                       :string
#  created_at                    :datetime         not null
#  updated_at                    :datetime         not null
#  configuration_profile_user_id :bigint           not null
#  domain_id                     :bigint           not null
#
# Indexes
#
#  index_specifications_on_configuration_profile_user_id  (configuration_profile_user_id)
#  index_specifications_on_domain_id                      (domain_id)
#
# Foreign Keys
#
#  fk_rails_...  (configuration_profile_user_id => configuration_profile_users.id) ON DELETE => cascade
#  fk_rails_...  (domain_id => domains.id)
#

###
# @description: Represents a specification uploaded by a user in
#   its original state, after the preview, but in an active record
#   form.
###
class Specification < ApplicationRecord
  include Slugable

  ###
  # @description: The user that created this specification
  ###
  belongs_to :configuration_profile_user

  ###
  # @description: The class (domain) that this specification is representing
  ###
  belongs_to :domain

  ###
  # @description: The properties this specification has
  ###
  has_and_belongs_to_many :terms

  has_one :configuration_profile, through: :configuration_profile_user
  has_one :organization, through: :configuration_profile_user
  has_one :user, through: :configuration_profile_user

  has_many :mappings

  ###
  # @description: If there's no specification for the user's company and the selected domain
  #   to map to, then it's the spine.
  ###
  after_create :spine!, unless: proc { domain.spine }
  after_save :spine!, if: proc { saved_change_to_domain_id? && !domain.spine }

  ###
  # @description: Validates the presence of a name before create
  ###
  validates :name, presence: true

  include Identifiable

  ###
  # @description: Mark this specification as spine for the related domain
  ###
  def spine!
    Spine.create!(
      configuration_profile_user:,
      domain:,
      name: domain.name
    )
  end

  ###
  # @description: Include additional information about the specification in
  #   json responses. This overrides the ApplicationRecord as_json method.
  ###
  def as_json(options = {})
    super(options.merge(methods: %i(domain)))
  end

  def to_json_ld
    {
      name:,
      uri:,
      version:,
      domain: domain.uri,
      terms: terms.map(&:source_uri).sort
    }
  end

  ###
  # @description: Returns the specification's compact domains
  ###
  def compact_domains(non_rdf: true)
    @compact_domains ||= Array.wrap(selected_domains_from_file).map { Utils.compact_uri(_1, non_rdf:) }.compact
  end

  scope :for_dso, ->(dso) { joins(:user).where(users: { id: dso.users }) }
end
