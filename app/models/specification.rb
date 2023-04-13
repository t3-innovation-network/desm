# frozen_string_literal: true

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
      configuration_profile_user: configuration_profile_user,
      domain: domain,
      name: domain.name
    )
  end

  ###
  # @description: Include additional information about the specification in
  #   json responses. This overrides the ApplicationRecord as_json method.
  ###
  def as_json(options={})
    super options.merge(methods: %i[domain])
  end

  def to_json_ld
    {
      name: name,
      uri: uri,
      version: version,
      use_case: use_case,
      domain: domain.uri,
      terms: terms.map(&:source_uri).sort
    }
  end

  scope :for_dso, ->(dso) { where(user: dso.users) }
end
