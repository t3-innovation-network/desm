# frozen_string_literal: true

# == Schema Information
#
# Table name: configuration_profiles
#
#  id                        :bigint           not null, primary key
#  description               :text
#  json_abstract_classes     :jsonb
#  json_mapping_predicates   :jsonb
#  name                      :string
#  predicate_strongest_match :string
#  slug                      :string
#  state                     :integer          default("incomplete"), not null
#  structure                 :jsonb
#  created_at                :datetime         not null
#  updated_at                :datetime         not null
#  administrator_id          :bigint
#  domain_set_id             :bigint
#  predicate_set_id          :bigint
#
# Indexes
#
#  index_configuration_profiles_on_administrator_id  (administrator_id)
#  index_configuration_profiles_on_domain_set_id     (domain_set_id)
#  index_configuration_profiles_on_name              (name) UNIQUE
#  index_configuration_profiles_on_predicate_set_id  (predicate_set_id)
#
# Foreign Keys
#
#  fk_rails_...  (administrator_id => users.id) ON DELETE => nullify
#  fk_rails_...  (domain_set_id => domain_sets.id)
#  fk_rails_...  (predicate_set_id => predicate_sets.id)
#

###
# @description: The Data Ecosystem Schema Mapper tool (DESM) has been designed to accommodate the crosswalking of
#   1-to-n data standards that have been serialized using XML schema, JSON schema, or RDF Schema.  A single instance
#   of the DESM can accommodate 1-n separate crosswalking projects. The parameters of each crosswalking project are
#   defined in a Schema Mapping Profile (Configuration Profile) used to configure the instance of the DESM tool.
###
class ConfigurationProfile < ApplicationRecord
  include PgSearch::Model
  include Slugable
  audited

  attr_accessor :skip_update_organizations

  belongs_to :abstract_classes, class_name: "DomainSet", foreign_key: :domain_set_id, optional: true
  belongs_to :mapping_predicates, class_name: "PredicateSet", foreign_key: :predicate_set_id, optional: true
  belongs_to :administrator, class_name: "User", foreign_key: :administrator_id, optional: true
  has_many :configuration_profile_users, dependent: :destroy
  has_and_belongs_to_many :standards_organizations, class_name: "Organization"
  has_many :domains, through: :abstract_classes
  has_many :mappings, through: :configuration_profile_users
  has_many :specifications, through: :configuration_profile_users
  has_many :spines, through: :configuration_profile_users
  has_many :terms, through: :configuration_profile_users
  has_many :users, through: :configuration_profile_users
  has_many :predicates, through: :mapping_predicates
  has_many :vocabularies
  has_many :concepts, through: :vocabularies
  has_many :alignments, through: :mappings

  validates :name, uniqueness: true

  after_initialize :setup_schema_validators
  before_save :check_structure, if: :will_save_change_to_structure?
  # TODO: check if we really need that check
  before_save :check_predicate_strongest_match, if: :will_save_change_to_predicate_strongest_match?
  before_destroy :remove_orphan_organizations

  after_update :update_abstract_classes, if: :saved_change_to_json_abstract_classes?
  after_update :update_organizations, if: -> { active? && saved_change_to_structure? && !skip_update_organizations }
  after_update :update_predicates, if: :saved_change_to_json_mapping_predicates?
  after_update :update_predicat_set, if: :saved_change_to_predicate_strongest_match?

  # The possible states
  # 0. "incomplete" It does not have a complete structure attribute.
  # 1. "complete" The 'structure' attribute is complete, validated against a JSON schema. Ready to be activated.
  # 2. "active" It has the 'structure' attribute complete, validated against a JSON schema file and it has been
  #   activated, meaning all the entities around it (DSO's, agents, schema files and more) had been created by
  #   parsing the structure.
  # 3. "deactivated" Can not be operated unless it's for removal or export. It can only be activated again, which
  #   will not trigger the structure creation again.
  enum state: { incomplete: 0, complete: 1, active: 2, deactivated: 3 }

  pg_search_scope :search_by_name, against: :name, using: { tsearch: { prefix: true } }

  scope :activated, -> { where(state: %i(active deactivated)) }
  scope :with_shared_mappings, -> { joins(:mappings).where(mappings: { status: Mapping.statuses[:mapped] }).distinct }

  COMPLETE_SCHEMA = Rails.root.join("ns", "complete.configurationProfile.schema.json")
  VALID_SCHEMA = Rails.root.join("ns", "valid.configurationProfile.schema.json")

  def check_predicate_strongest_match
    throw :abort if json_mapping_predicates.nil?

    concepts = Parsers::Skos.new(file_content: json_mapping_predicates).concept_names
    throw :abort unless concepts.map { |c| c[:uri] }.include?(predicate_strongest_match)
  end

  def self.complete_schema
    read_schema(COMPLETE_SCHEMA)
  end

  def self.valid_schema
    read_schema(VALID_SCHEMA)
  end

  def self.read_schema(schema)
    JSON.parse(
      File.read(schema)
    )
  end

  def self.activated_states_for_select
    ConfigurationProfile.states_for_select(%w(active deactivated))
  end

  def self.states_for_select(data = ConfigurationProfile.states.keys)
    data.map { |state| { id: state, name: state.humanize } }
  end

  def self.validate_structure(struct, type = "valid")
    struct = struct.deep_transform_keys { |key| key.to_s.camelize(:lower) }
    JSON::Validator.fully_validate(
      type.eql?("valid") ? valid_schema : complete_schema,
      struct
    )
  end

  def activate!
    state_handler.activate!
  end

  def activated?
    active? || deactived?
  end

  def check_structure
    if complete? && !structure_complete?
      incomplete!
    elsif incomplete? && structure_complete?
      complete!
    end
  end

  def complete!
    state_handler.complete!
  end

  def incomplete!
    state_handler.incomplete!
  end

  def deactivate!
    state_handler.deactivate!
  end

  def delete!
    raise "In progress mappings, unable to remove" if mappings.in_progress.any?

    delete
  end

  def export!
    state_handler.export!
  end

  def generate_structure
    CreateCpStructure.call({ configuration_profile: self })
  end

  def remove!
    state_handler.remove!
  end

  def setup_schema_validators
    @complete_schema = self.class.complete_schema
    @valid_schema = self.class.valid_schema
  end

  def state_handler
    "CpState::#{state.capitalize}".constantize.new(self)
  end

  def structure_valid?
    validation = self.class.validate_structure(structure, "valid")
    validation.empty?
  end

  def structure_complete?
    validation = self.class.validate_structure(structure, "complete")
    validation.empty?
  end

  def transition_to!(new_state)
    public_send(persisted? ? :update_column : :update_attribute, :state, new_state)
  end

  def with_shared_mappings?
    active? && mappings.mapped.any?
  end

  private

  def update_organizations
    interactor = UpdateDsos.call(configuration_profile: self)
    raise ArgumentError, interactor.error unless interactor.success?
  end

  def remove_orphan_organizations
    standards_organizations.each do |organization|
      next if organization.configuration_profiles.count > 1

      organization.destroy
    end
  end

  def update_abstract_classes
    return if abstract_classes.nil? || json_abstract_classes.nil?

    interactor = UpdateAbstractClasses.call(domain_set: abstract_classes, json_body: json_abstract_classes)
    raise ArgumentError, interactor.error unless interactor.success?
  end

  def update_predicates
    return if mapping_predicates.nil? || json_mapping_predicates.nil?

    interactor = UpdateMappingPredicates.call(predicate_set: mapping_predicates, json_body: json_mapping_predicates)
    raise ArgumentError, interactor.error unless interactor.success?
  end

  def update_predicat_set
    return if mapping_predicates.nil? || predicate_strongest_match.blank?

    strongest_match = mapping_predicates.predicates.find_by!(source_uri: predicate_strongest_match)
    mapping_predicates.update(strongest_match:)
  end
end
