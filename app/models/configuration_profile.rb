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

  # The possible states
  # 1. "incomplete" It does not have a complete structure attribute.
  # 2. "complete" The 'structure' attribute is complete, validated against a JSON schema. Ready to be activated.
  # 3. "active" It has the 'structure' attribute complete, validated against a JSON schema file and it has been
  #   activated, meaning all the entities around it (DSO's, agents, schema files and more) had been created by
  #   parsing the structure.
  enum state: {incomplete: 0, complete: 1, active: 2}

  def activate
    state_class.activate
  end

  def complete
    state_class.complete
  end

  def deactivate
    state_class.deactivate
  end

  def export
    state_class.export
  end

  def remove
    state_class.remove
  end

  def state_class= new_state
    self.state = new_state
    save!
  end

  def state_class
    "CpState::#{state.capitalize}".constantize.new(self)
  end
end
