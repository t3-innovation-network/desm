# frozen_string_literal: true

# == Schema Information
#
# Table name: mappings
#
#  id                            :bigint           not null, primary key
#  description                   :text
#  name                          :string
#  slug                          :string
#  status                        :integer          default("uploaded")
#  title                         :string
#  created_at                    :datetime         not null
#  updated_at                    :datetime         not null
#  configuration_profile_user_id :bigint           not null
#  specification_id              :bigint           not null
#  spine_id                      :integer
#
# Indexes
#
#  index_mappings_on_configuration_profile_user_id  (configuration_profile_user_id)
#  index_mappings_on_specification_id               (specification_id)
#
# Foreign Keys
#
#  fk_rails_...  (configuration_profile_user_id => configuration_profile_users.id) ON DELETE => cascade
#  fk_rails_...  (specification_id => specifications.id)
#

###
# @description: Represents a mapping, which is the concept of the merge
#   between 2 specifications.
#
#   It's created when the user uploads a specification for a domain which
#   already has a spine (a previous specification was uploaded for it).
###
class Mapping < ApplicationRecord
  include Slugable

  ###
  # @description: This will allow to keep track of every change in this model using the 'audits' method
  ###
  audited

  ###
  # RELATIONSHIPS
  ###

  ###
  # @description: The configuration_profile/user combo that this mapping belongs to
  ###
  belongs_to :configuration_profile_user
  ###
  # @description: The specification that was uploaded to create this mapping
  ###
  belongs_to :specification, dependent: :destroy
  ###
  # @description: The specification chosen to map to
  ###
  belongs_to :spine

  has_one :organization, through: :configuration_profile_user

  has_one :user, through: :configuration_profile_user

  has_one :configuration_profile, through: :configuration_profile_user

  has_one :mapping_predicates, through: :configuration_profile

  has_many :alignments
  ###
  # @description: The selected terms from the original uploaded specification. The user can select one
  #   ore more terms from it.
  ###
  has_and_belongs_to_many :selected_terms, join_table: :mapping_selected_terms, class_name: :Term

  ###
  # VALIDATIONS
  ###

  ###
  # @description: Validates the presence of a name for the mapping
  ###
  validates :name, presence: true
  # The possible status of a mapping
  # 1. "uploaded" It means that there's a specification uploaded but not
  #    terms mapped
  # 2. "in-progress" It means that the user is already mapping terms but
  #    not yet finished mapping
  # 3. "mapped" It means the terms are confirmed as mapped to the spine
  enum status: { uploaded: 0, in_progress: 1, mapped: 2 }

  ###
  # CALLBACKS
  ###

  ###
  # @description: Every mapping should have the same number of terms as the associated spine terms
  ###
  after_create :generate_alignments

  ###
  # METHODS
  ###

  ###
  # @description: Include additional information about the mapping in
  #   json responses. This overrides the ApplicationRecord as_json method.
  ###
  def as_json(options = {})
    super(options.merge(
      methods: %i(uploaded? mapped? in_progress? origin spine_origin domain mapped_terms new_spine_created?)
    ))
  end

  ###
  # @description: Creates the terms for the mapping (alignments).
  ###
  def generate_alignments(first_upload: false)
    predicate_id = mapping_predicates.strongest_match_id if first_upload

    spine.terms.each do |term|
      alignments.create!(
        mapped_terms: (first_upload ? [term] : []),
        predicate_id:,
        spine_term_id: term.id,
        uri: term.uri
      )
    end
  end

  ###
  # @description: The domain that this mapping is for. It's taken from the
  #   related specification
  # @return [String]
  ###
  def domain
    specification.domain.pref_label
  end

  ###
  # @description: Exports the mapping into json-ld format
  ###
  def export
    exporter = Exporters::Mapping.new(self)
    exporter.export
  end

  ###
  # @description: Get the users who worked in this mapping
  ###
  def involved_users
    User.where(id: alignments.joins(:audits).distinct.select("audits.user_id"))
  end

  ###
  # @description: Returns the number of terms that are already mapped
  # @return [Integer]
  ###
  def mapped_terms
    alignments.joins(:mapped_terms).distinct.count(:id)
  end

  ###
  # @description: Notify the user about changes on the mapping
  ###
  def notify_updated
    involved_users.each do |user|
      MappingMailer.with(mapping: self, user:).updated.deliver_now
    end
  end

  ###
  # @description: The organization that originated this term
  # @return [String]
  ###
  def origin
    organization.name
  end

  ###
  # @description: Remove all alignments from a mapping
  ###
  def remove_alignments_mapped_terms
    alignments.each do |alignment|
      alignment.mapped_term_ids = []
      alignment.predicate_id = nil
      alignment.save!
    end
  end

  ###
  # @description: The organization that originated the spine
  # @return [String]
  ###
  def spine_origin
    spine.organization.name
  end

  def new_spine_created?
    spine.mappings.count == 1
  end

  ###
  # @description: Associate the terms to this mapping. NOTE: This method will replace the previous
  #   associated terms, so if you need to add terms, maintaining the previous ones, include the
  #   previous ids in the params.
  #
  # @param [Array] ids: A collection of ids representing the terms that are
  #   going to be added as "selected" to this mapping
  ###
  def update_selected_terms(ids)
    self.selected_term_ids = ids
    return if spine.terms.any?

    spine.term_ids = ids
    generate_alignments(first_upload: true)
  end
end
