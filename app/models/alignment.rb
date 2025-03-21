# frozen_string_literal: true

# == Schema Information
#
# Table name: alignments
#
#  id             :bigint           not null, primary key
#  comment        :text
#  synthetic      :boolean          default(FALSE), not null
#  transformation :jsonb
#  uri            :string
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  mapping_id     :bigint           not null
#  predicate_id   :bigint
#  spine_term_id  :integer
#  vocabulary_id  :bigint
#
# Indexes
#
#  index_alignments_on_mapping_id     (mapping_id)
#  index_alignments_on_predicate_id   (predicate_id)
#  index_alignments_on_vocabulary_id  (vocabulary_id)
#
# Foreign Keys
#
#  fk_rails_...  (mapping_id => mappings.id) ON DELETE => cascade
#  fk_rails_...  (predicate_id => predicates.id)
#  fk_rails_...  (spine_term_id => terms.id) ON DELETE => cascade
#  fk_rails_...  (vocabulary_id => vocabularies.id)
#

###
# @description: Represents a mapping term, which is each of terms resulting of a merge between 2 specifications. It's
# also called an "Alignment".
#
#   It's created when the user selects a term from the specification to map against the spine.
###
class Alignment < ApplicationRecord
  ###
  # @description: This will allow to keep track of every change in this model using the 'audits' method
  ###
  audited

  ###
  # RELATIONSHIPS
  ###

  ###
  # @description: The mapping this term belongs to.
  ###
  belongs_to :mapping

  ###
  # @description: The relation between the spine term and the uploaded specification
  #   term is described with a predicate.
  ###
  belongs_to :predicate, optional: true
  ###
  # @description: The term from the spine specification.
  ###
  belongs_to :spine_term, foreign_key: "spine_term_id", class_name: "Term", optional: true
  ###
  # @description: After matching some terms from the uploaded specification, we store it here.
  ###
  has_and_belongs_to_many :mapped_terms, join_table: :alignment_mapped_terms, class_name: :Term

  has_one :configuration_profile, through: :mapping

  has_one :specification, through: :mapping

  has_one :spine, through: :mapping

  ###
  # @description: If this mapping term has a vocabulary and the spine term also does, it will be
  #   necessary to map the 2 of it
  ###
  has_one :vocabulary, class_name: :AlignmentVocabulary

  has_many :alignment_vocabularies

  ###
  # VALIDATIONS
  ###

  ###
  # @description: Validates the presence of a uri before creating
  ###
  validates :uri, presence: true

  ###
  # CALLBACKS
  ###

  ###
  # @description: When chenages are made against the mapping that's already finished, we notify the involved users.
  ###
  after_update :notify_mapping_updated, if: proc { mapping.mapped? }

  before_destroy { mapped_terms.clear }
  ###
  # @description: If we're going to remove a mapping term (an alignment), we also remove the spine term in the spine
  #   specification if it's a synthetic property. If we don't do this, the alignment will not exist, but the spine
  #   will have a property with its name, and that's inconsistent.
  ###
  before_destroy :remove_spine_term, if: :synthetic

  scope :mapped_for_spine, ->(spine_id) { joins(:mapping).where(mappings: { status: :mapped, spine_id: }) }

  delegate :domain, to: :mapping

  delegate :compact_domains, to: :specification

  ###
  # METHODS
  ###

  ###
  # @description: Include additional information about the mapping in
  #   json responses. This overrides the ApplicationRecord as_json method.
  ###
  def as_json(options = {})
    super(options.merge(methods: %i(origin)))
  end

  def completed?
    return true if predicate&.source_uri.present? && predicate.source_uri.downcase.include?("nomatch")
    return true if predicate.present? && mapped_terms.exists?

    false
  end

  ###
  # @description: Notify the user about changes on the mapping
  ###
  def notify_mapping_updated
    # update the mapping updated_at attribute && mapped_at time
    mapping.touch(:mapped_at)
    # mapping.notify_updated
  end

  ###
  # @description: The organization that originated this alignment
  # @return [String]
  ###
  def origin
    mapping.origin
  end

  ###
  # @description: Removes the related spine term
  ###
  def remove_spine_term
    mapping.spine.terms -= [spine_term] if mapping.spine.present?
  end

  ###
  # @description: Associate the terms to this alignment. NOTE: This method will replace the previous
  #   associated terms, so if you need to add terms, maintaining the previous ones, include the
  #   previous ids in the params.
  #
  # @param [Array] ids: A collection of ids representing the terms that are
  #   going to be mapped to this alignment
  ###
  def update_mapped_terms(ids)
    self.mapped_term_ids = ids
  end
end
