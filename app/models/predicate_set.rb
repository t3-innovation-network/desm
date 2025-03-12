# frozen_string_literal: true

# == Schema Information
#
# Table name: predicate_sets
#
#  id                 :bigint           not null, primary key
#  creator            :string
#  description        :text
#  max_weight         :float            default(0.0), not null
#  slug               :string
#  source_uri         :string           not null
#  title              :string           not null
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  strongest_match_id :bigint
#
# Indexes
#
#  index_predicate_sets_on_strongest_match_id  (strongest_match_id)
#
# Foreign Keys
#
#  fk_rails_...  (strongest_match_id => predicates.id) ON DELETE => restrict
#

###
# @description: Represents a Concept Scheme, with is a set of predicates
#   (in form of skos concepts) to map to.
#
#   There's a rake task that will feed the domain sets and predicates by
#   reading and parsing each file inside the "ns" directory.
###
class PredicateSet < ApplicationRecord
  include Slugable
  audited

  validates :source_uri, presence: true
  validates :title, presence: true

  belongs_to :strongest_match, class_name: "Predicate", optional: true
  has_one :configuration_profile
  has_many :predicates, after_add: :update_max_weight, after_remove: :update_max_weight

  alias_attribute :name, :title

  def update_max_weight(_predicate)
    update_attribute(:max_weight, predicates.maximum(:weight) || 0)
  end

  def to_json_ld
    {
      name: title,
      uri:,
      source_uri:,
      description:,
      created_at:,
      predicates: predicates.map(&:to_json_ld),
      strongest_match: strongest_match&.source_uri
    }
  end
end
