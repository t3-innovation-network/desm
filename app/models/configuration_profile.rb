# frozen_string_literal: true

###
# @description: The Data Ecosystem Schema Mapper tool (DESM) has been designed to accommodate the crosswalking of
#   1-to-n data standards that have been serialized using XML schema, JSON schema, or RDF Schema.  A single instance
#   of the DESM can accommodate 1-n separate crosswalking projects. The parameters of each crosswalking project are
#   defined in a Schema Mapping Profile (Configuration Profile) used to configure the instance of the DESM tool.
###
class ConfigurationProfile < ApplicationRecord
  belongs_to :abstract_classes, class_name: "DomainSet", foreign_key: :domain_set_id, optional: true
  belongs_to :mapping_predicates, class_name: "PredicateSet", foreign_key: :predicate_set_id, optional: true
  belongs_to :administrator, class_name: "User", foreign_key: :administrator_id, optional: true
  has_many :standards_organizations, class_name: "Organization", dependent: :destroy
  has_many :mappings, through: :standards_organizations
  after_initialize :setup_schema_validators
  before_save :check_structure, if: :incomplete?
  before_destroy :check_ongoing_mappings, prepend: true

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

  def self.validate_structure struct
    JSON::Validator.fully_validate(
      valid_schema,
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
    complete! if structure_complete?
  end

  def complete!
    state_handler.complete!
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
    validation = self.class.validate_structure(structure)
    validation.empty?
  end

  def structure_complete?
    validation = JSON::Validator.fully_validate(@complete_schema, structure)
    validation.empty?
  end

  def transition_to! new_state
    self.state = new_state
    save!
  end
end
