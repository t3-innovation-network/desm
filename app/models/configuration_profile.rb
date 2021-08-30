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
  belongs_to :administrator, class_name: "User", foreign_key: :administrator_id
  has_many :standards_ogranizations, class_name: "Organization"
  after_initialize :setup_schema_validators

  # The possible states
  # 1. "incomplete" It does not have a complete structure attribute.
  # 2. "complete" The 'structure' attribute is complete, validated against a JSON schema. Ready to be activated.
  # 3. "active" It has the 'structure' attribute complete, validated against a JSON schema file and it has been
  #   activated, meaning all the entities around it (DSO's, agents, schema files and more) had been created by
  #   parsing the structure.
  enum state: {incomplete: 0, complete: 1, active: 2}

  def setup_schema_validators
    @complete_schema = JSON.parse(File.read(Rails.root.join("ns", "complete.configurationProfile.schema.json")))
    @valid_schema = JSON.parse(File.read(Rails.root.join("ns", "valid.configurationProfile.schema.json")))
  end

  def activate!
    state_handler.activate!
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

  def remove
    state_handler.remove
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
