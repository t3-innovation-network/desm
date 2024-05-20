# frozen_string_literal: true

# == Schema Information
#
# Table name: properties
#
#  id              :bigint           not null, primary key
#  comment         :text
#  domain          :jsonb
#  label           :string
#  path            :string
#  range           :jsonb
#  scheme          :string
#  selected_domain :string
#  selected_range  :string
#  source_uri      :string
#  subproperty_of  :string
#  uri             :string
#  value_space     :string
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  term_id         :bigint           not null
#
# Indexes
#
#  index_properties_on_term_id  (term_id)
#
# Foreign Keys
#
#  fk_rails_...  (term_id => terms.id) ON DELETE => cascade
#

###
# @description: Represents a property of a term in a specification
#   uploaded by a user
###
class Property < ApplicationRecord
  audited

  belongs_to :term
  before_update :update_term, if: -> { label_changed? || source_uri_changed? }

  delegate :comments, to: :term

  ###
  # @description: Returns the property's compact domains
  ###
  def compact_domains(non_rdf: true)
    @compact_domains ||= Array.wrap(domain).map { Utils.compact_uri(_1, non_rdf:) }.compact
  end

  ###
  # @description: Returns the property's compact ranges
  ###
  def compact_ranges
    @compact_ranges ||= Array.wrap(range).map { Utils.compact_uri(_1) }.compact
  end

  private

  def update_term
    return if term.name == label && term.source_uri == source_uri

    term.update!(name: label, source_uri:)
    self.uri = term.uri
  end
end
