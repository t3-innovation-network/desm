# frozen_string_literal: true

# == Schema Information
#
# Table name: terms
#
#  id                            :bigint           not null, primary key
#  identifier                    :string
#  name                          :string
#  raw                           :json             not null
#  slug                          :string
#  source_uri                    :string           not null
#  created_at                    :datetime         not null
#  updated_at                    :datetime         not null
#  configuration_profile_user_id :bigint           not null
#
# Indexes
#
#  index_terms_on_configuration_profile_user_id  (configuration_profile_user_id)
#
# Foreign Keys
#
#  fk_rails_...  (configuration_profile_user_id => configuration_profile_users.id) ON DELETE => cascade
#

###
# @description: Represents a node of a specification
###
class Term < ApplicationRecord
  include Slugable
  audited

  belongs_to :configuration_profile_user

  ###
  # @description: The specifications in which this term appears. Can be many
  ###
  has_and_belongs_to_many :specifications

  has_one :configuration_profile, through: :configuration_profile_user

  has_one :mapping_predicates, through: :configuration_profile

  has_one :organization, through: :configuration_profile_user

  ###
  # @description: The property for this term, an entity that contains all the rdf property information
  ###
  has_one :property, dependent: :destroy

  has_many :alignments, foreign_key: :spine_term_id
  has_many :alignment_vocabularies, through: :alignments

  ###
  # @description: The skos concept scheme (vocabulary), for this term. It can be many, but in the most
  #   common situations, each term will have 0 or 1 vocabulary
  ###
  has_and_belongs_to_many :vocabularies

  validates :name, presence: true
  validates :raw, presence: true

  ###
  # @description: Accept to update and/or create properties along with terms
  ###
  accepts_nested_attributes_for :property, allow_destroy: true

  after_create :assign_property, unless: proc { property.present? }

  before_destroy :check_if_alignments_exist

  delegate :compact_domains, :compact_ranges, to: :property

  ###
  # @description: Include additional information about the specification in
  #   json responses. This overrides the ApplicationRecord as_json method.
  ###
  def as_json(options = {})
    super(options.merge(methods: %i(max_mapping_weight uri organization)))
  end

  def max_mapping_weight
    configuration_profile.standards_organizations.count * mapping_predicates&.max_weight.to_f
  end

  ###
  # @description: Build and return the uri with the "desm" prefix
  # @return [String]: the desm namespaced uri
  ###
  def desm_uri(domain = nil)
    "desm-#{organization.name.downcase.strip}-#{domain&.pref_label&.downcase&.strip}:#{uri.split(':').last}"
  end

  def assign_property
    parser = Parsers::JsonLd::Node.new(raw)
    domain = parser.read_as_array("domain")
    range = parser.read_as_array("range")

    Property.create!(
      term: self,
      uri:,
      source_uri: parser.read!("id"),
      comment: parser.read!("comment"),
      label: parser.read!("label") || parser.read!("id"),
      domain:,
      selected_domain: domain&.first,
      range:,
      selected_range: range&.first,
      subproperty_of: parser.read!("subproperty")
    )
  end

  def check_if_alignments_exist
    return if alignments.none?
    return if (alignments_completed = alignments.includes(:predicate).select(&:completed?)).blank?

    mappings = alignments_completed.map { |a| a.mapping.title }.uniq.sort

    raise "Cannot remove a term with existing alignments. " \
          "Please remove corresponding alignments from #{mappings.join(', ')} mappings before removing the term."
  end

  def comments
    node = Parsers::JsonLd::Node.new(raw.slice("rdfs:comment"))
    sanitizer = Rails::Html::FullSanitizer.new
    node.read_as_language_map("comment").map { sanitizer.sanitize(_1) }
  end
end
