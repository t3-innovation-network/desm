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
  has_many :standards_ogranizations, class_name: "Organization"
  after_initialize :setup_schema_validators
  before_save :check_structure, if: :incomplete?

  # The possible states
  # 0. "incomplete" It does not have a complete structure attribute.
  # 1. "complete" The 'structure' attribute is complete, validated against a JSON schema. Ready to be activated.
  # 2. "active" It has the 'structure' attribute complete, validated against a JSON schema file and it has been
  #   activated, meaning all the entities around it (DSO's, agents, schema files and more) had been created by
  #   parsing the structure.
  # 3. "deactivated" Can not be operated unless it's for removal or export. It can only be activated again, which
  #   will not trigger the structure creation again.
  enum state: {incomplete: 0, complete: 1, active: 2, deactivated: 3}

  def activate!
    state_handler.activate!
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

  def export
    state_handler.export
  end

  def generate_structure
    CreateCpStructure.call({configuration_profile: self})
  end

  def remove
    state_handler.remove
  end

  def setup_schema_validators
    @complete_schema = JSON.parse(File.read(Rails.root.join("ns", "complete.configurationProfile.schema.json")))
    @valid_schema = JSON.parse(File.read(Rails.root.join("ns", "valid.configurationProfile.schema.json")))
  end

  def state_handler
    "CpState::#{state.capitalize}".constantize.new(self)
  end

  def structure_valid?
    JSON::Validator.validate(@valid_schema, structure)
  end

  def structure_complete?
    JSON::Validator.validate(@complete_schema, structure)
  end

  def transition_to! new_state
    self.state = new_state
    save!
  end
end
