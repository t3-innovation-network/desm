# frozen_string_literal: true

###
# @description: Represents a specification uploaded by a user in
#   its original state, after the preview, but in an active record
#   form.
###
class Specification < ApplicationRecord
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
  # @description: Assigns an internal uri
  ###
  before_create :assign_uri

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

  ###
  # @description: Validate the uri existence and presence before create
  ###
  validates :uri, presence: true, uniqueness: true

  include Identifiable

  ###
  # @description: Assigns the uri before saving into the database. The uri must be unique
  #   and generated by the tool.
  ###
  def assign_uri
    self.uri = user.organization.name.downcase + "/" + domain.pref_label.downcase + "/" + unique_id
  end

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
    domain.spine? && domain.spine_id == id
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
end
