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
  belongs_to :user

  ###
  # @description: The class (domain) that this specification is representing
  ###
  belongs_to :domain

  ###
  # @description: The properties this specification has
  ###
  has_and_belongs_to_many :terms

  ###
  # @description: If there's no specification for the user's company and the selected domain
  #   to map to, then it's the spine.
  ###
  after_create :spine!, unless: proc { domain.spine }

  ###
  # @description: A specification that's being mapped should not be removed
  ###
  before_destroy :dependent_mapping_exists?

  ###
  # @description: Set the domain available to set a spine again
  ###
  before_destroy :nullify_domain_spine

  ###
  # @description: Validates the presence of a name before create
  ###
  validates :name, presence: true

  include Identifiable

  ###
  # @description: Mark this specification as spine for the related domain
  ###
  def spine!
    domain.update_column(:spine_id, id)
  end

  ###
  # @description: Returns the spine info about this specification serves as.
  # @return [TrueClass|FalseClass]
  ###
  def spine?
    domain.spine.present? && domain.spine.id == id
  end

  ###
  # @description: Include additional information about the specification in
  #   json responses. This overrides the ApplicationRecord as_json method.
  ###
  def as_json(options={})
    super options.merge(methods: %i[spine? domain])
  end

  ###
  # @description: Verifies if there's a specification that's being mapped against this one. A
  #   specification that's being mapped should not be removed.
  # @return [TrueClass|FalseClass]
  ###
  def dependent_mapping_exists?
    throw :abort if Mapping.where(spine_id: id).count.positive?
  end

  ###
  # @description: Ensure that if this specification is a spine for a domain,
  #   the domain doesn't references it anymore.
  ###
  def nullify_domain_spine
    Domain.where(spine: self).each {|d| d.update_column(:spine_id, nil) }
  end

  def to_json_ld
    {
      name: name,
      uri: uri,
      version: version,
      use_case: use_case,
      domain: domain.uri,
      terms: terms.map(&:uri).sort
    }
  end

  scope :for_dso, ->(dso) { where(user: dso.users) }
end
