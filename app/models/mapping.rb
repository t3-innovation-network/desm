# frozen_string_literal: true

###
# @description: Represents a mapping, which is the concept of the merge
#   between 2 specifications.
#
#   It's created when the user uploads a specification for a domain which
#   already has a spine (a previous specification was uploaded for it).
###
class Mapping < ApplicationRecord
  belongs_to :user
  belongs_to :specification
  belongs_to :spine, foreign_key: "spine_id", class_name: :Specification
  has_many :terms, class_name: :MappingTerm, dependent: :destroy
  has_and_belongs_to_many :selected_terms, join_table: :mapping_selected_terms, class_name: :Term
  validates :name, presence: true

  # The possible status of a mapping
  # 1. "uploaded" It means that there's a specification uploaded but not
  #    terms mapped
  # 2. "in-progress" It means that the user is already mapping terms but
  #    not yet finished mapping
  # 3. "mapped" It means the terms are confirmed as mapped to the spine
  enum status: {uploaded: 0, in_progress: 1, mapped: 2}

  ###
  # @description: The organization that originated this term
  # @return [String]
  ###
  def origin
    user.organization.name
  end

  ###
  # @description: The organization that originated this the spine
  # @return [String]
  ###
  def spine_origin
    spine.user.organization.name
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
  # @description: Include additional information about the mapping in
  #   json responses. This overrides the ApplicationRecord as_json method.
  ###
  def as_json(options={})
    super options.merge(methods: %i[uploaded? mapped? in_progress? origin spine_origin domain])
  end
end
