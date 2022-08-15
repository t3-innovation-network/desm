# frozen_string_literal: true

###
# @description: The Data Ecosystem Schema Mapper tool (DESM) has been designed to accommodate the crosswalking of
#   1-to-n data standards that have been serialized using XML schema, JSON schema, or RDF Schema.  A single instance
#   of the DESM can accommodate 1-n separate crosswalking projects. The parameters of each crosswalking project are
#   defined in a Schema Mapping Profile (Configuration Profile) used to configure the instance of the DESM tool.
###
class ConfigurationProfile < ApplicationRecord
  include Slugable

  belongs_to :abstract_classes, class_name: "DomainSet", foreign_key: :domain_set_id, optional: true
  belongs_to :mapping_predicates, class_name: "PredicateSet", foreign_key: :predicate_set_id, optional: true
  belongs_to :administrator, class_name: "User", foreign_key: :administrator_id, optional: true
  has_many :standards_organizations, class_name: "Organization", dependent: :destroy
  has_many :mappings, through: :standards_organizations
  has_many :spines, through: :standards_organizations
  has_many :terms, through: :standards_organizations

  after_initialize :setup_schema_validators
  before_save :check_structure, if: :structure_changed?
  before_save :check_predicate_strongest_match, if: :predicate_strongest_match_changed?
  before_destroy :check_ongoing_mappings, prepend: true
  after_save :create_new_entities, if: :active?

  # The possible states
  # 0. "incomplete" It does not have a complete structure attribute.
  # 1. "complete" The 'structure' attribute is complete, validated against a JSON schema. Ready to be activated.
  # 2. "active" It has the 'structure' attribute complete, validated against a JSON schema file and it has been
  #   activated, meaning all the entities around it (DSO's, agents, schema files and more) had been created by
  #   parsing the structure.
  # 3. "deactivated" Can not be operated unless it's for removal or export. It can only be activated again, which
  #   will not trigger the structure creation again.
  enum state: {incomplete: 0, complete: 1, active: 2, deactivated: 3}

  COMPLETE_SCHEMA = Rails.root.join("ns", "complete.configurationProfile.schema.json")
  VALID_SCHEMA = Rails.root.join("ns", "valid.configurationProfile.schema.json")

  def check_predicate_strongest_match
    throw :abort if json_mapping_predicates.nil?

    concepts = Parsers::Skos.new(file_content: json_mapping_predicates).concept_names
    throw :abort unless concepts.map {|c| c[:uri] }.include?(predicate_strongest_match)
  end

  def self.complete_schema
    read_schema(COMPLETE_SCHEMA)
  end

  def self.valid_schema
    read_schema(VALID_SCHEMA)
  end

  def self.read_schema schema
    JSON.parse(
      File.read(schema)
    )
  end

  def self.validate_structure struct, type="valid"
    struct = struct.deep_transform_keys {|key| key.to_s.camelize(:lower) }
    JSON::Validator.fully_validate(
      type.eql?("valid") ? valid_schema : complete_schema,
      struct
    )
  end

  def activate!
    state_handler.activate!
  end

  def check_ongoing_mappings
    return unless mappings.in_progress.any?

    errors.add(:base, "In progress mappings, unable to remove")
    throw :abort
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

  def export!
    state_handler.export!
  end

  def generate_structure
    CreateCpStructure.call({configuration_profile: self})
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

  def transition_to! new_state
    update_attribute(:state, new_state)
  end

  private

  def create_new_entities
    structure.fetch("standards_organizations", []).each do |dso_data|
      CreateDso.call(dso_data.merge(configuration_profile: self))
    rescue StandardError
      nil
    end
  end
end
