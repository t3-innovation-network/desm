# frozen_string_literal: true

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
  ###
  # @description: If this mapping term has a vocabulary and the spine term also does, it will be
  #   necessary to map the 2 of it
  ###
  has_one :vocabulary, class_name: :AlignmentVocabulary

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

  ###
  # METHODS
  ###

  ###
  # @description: Include additional information about the mapping in
  #   json responses. This overrides the ApplicationRecord as_json method.
  ###
  def as_json(options={})
    super options.merge(methods: %i[origin])
  end

  ###
  # @description: Notify the user about changes on the mapping
  ###
  def notify_mapping_updated
    mapping.notify_updated
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
    spine_term.destroy!
  end

  ###
  # @description: Associate the terms to this alignment. NOTE: This method will replace the previous
  #   associated terms, so if you need to add terms, maintaining the previous ones, include the
  #   previous ids in the params.
  #
  # @param [Array] ids: A collection of ids representing the terms that are
  #   going to be mapped to this alignment
  ###
  def update_mapped_terms ids
    self.mapped_term_ids = ids
  end
end
