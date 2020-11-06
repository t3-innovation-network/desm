# frozen_string_literal: true

###
# @description: Represents a mapping term, which is each of terms resulting of
#   a merge between 2 specifications. It's also called an "Alignment"
#
#   It's created when the user selects a term from the specification to map
#   against the spine.
###
class MappingTerm < ApplicationRecord
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
  has_and_belongs_to_many :mapped_terms, join_table: :mapping_term_mapped_terms, class_name: :Term

  ###
  # @description: If this mapping term has a vocabulary and the spine term also does, it will be
  #   necessary to map the 2 of it
  ###
  has_one :vocabulary, class_name: :AlignmentVocabulary

  validates :uri, presence: true

  ###
  # @description: Associate the terms to this alignment. NOTE: This method will replace the previous
  #   associated terms, so if you need to add terms, maintaining the previous ones, include the
  #   previous ids in the params.
  #
  # @param [Array] mapped_term_ids: A collection of ids representing the terms that are
  #   going to be mapped to this alignment
  ###
  def update_mapped_terms ids
    self.mapped_term_ids = ids
  end
end
