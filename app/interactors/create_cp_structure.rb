# frozen_string_literal: true

class AbstractClassesCreationError < StandardError; end
class AdminCreationError < StandardError; end
class ConceptSchemeCreationError < StandardError; end
class DSOAdminCreationError < StandardError; end
class DSOCreationError < StandardError; end
class DSOMapperCreationError < StandardError; end
class MappingPredicatesCreationError < StandardError; end

class CreateCpStructure
  include Interactor

  before do
    context.fail!(error: "configuration_profile must be present") unless context.configuration_profile.present?
    context.fail!(error: "incomplete structure") unless context.configuration_profile.structure_complete?
    @structure = context
                 .configuration_profile.structure
                 .deep_transform_keys {|key| key.to_s.underscore }
                 .with_indifferent_access
    @cp = context.configuration_profile
  end

  around do |interactor|
    ActiveRecord::Base.transaction do
      interactor.call
    end
  end

  after do
    @cp.save!
  end

  def call
    assign_administrator
    generate_abstract_classes
    generate_mapping_predicates
    generate_dsos_data
  end

  private

  def assign_administrator
    result = CreateAgent.call(@structure[:profile_administrator].merge({role: Role.find_by_name("profile admin")}))
    raise AdminCreationError unless result.error.nil?

    @cp.update(administrator: result.agent)
  end

  def generate_abstract_classes
    result = CreateAbstractClasses.call({uri: @structure[:abstract_classes][:origin].first})
    raise AbstractClassesCreationError unless result.error.nil?

    @cp.update(abstract_classes: result.domain_set)
  end

  def generate_mapping_predicates
    result = CreateMappingPredicates.call({uri: @structure[:mapping_predicates][:origin].first})
    raise MappingPredicatesCreationError unless result.error.nil?

    @cp.update(mapping_predicates: result.predicate_set)
  end

  def generate_dsos_data
    @structure[:standards_organizations].each do |dso_data|
      dso_admin = create_dso_admin(dso_data[:dso_administrator])
      dso = create_dso(dso_data.merge({administrator: dso_admin}))
      dso_admin.update!(organization: dso)
      create_dso_agents(dso, dso_data[:dso_agents])
      create_dso_schemas(dso, dso_data[:associated_schemas])
    end
  end

  def create_dso dso_data
    result = CreateDso.call(dso_data.merge({configuration_profile: @cp}))
    raise DSOCreationError unless result.error.nil?

    result.dso
  end

  def create_dso_admin dso_admin_data
    result = CreateAgent.call(dso_admin_data.merge({role: Role.find_by_name("dso admin")}))
    raise DSOAdminCreationError unless result.error.nil?

    result.agent
  end

  def create_dso_agents dso, agents_data
    agents_data.each do |agent_data|
      result = CreateAgent.call(agent_data.merge({role: Role.find_by_name("mapper"), organization: dso}))
      raise DSOMapperCreationError unless result.error.nil?

      dso.users << result.agent
    end
  end

  def create_dso_schemas dso, schemas_data
    schemas_data.each do |schema_data|
      domain = Domain.find_by_uri schema_data[:associated_abstract_class]
      result = CreateSchema.call({
                                   domain_id: domain.id,
                                   name: schema_data[:name],
                                   user: dso.administrator,
                                   uri: schema_data[:origin]
                                 })

      raise DSOMapperCreationError unless result.error.nil?

      create_concept_schemes(dso, schema_data[:associated_concept_schemes]) if schema_data[:associated_concept_schemes]
    end
  end

  def create_concept_schemes dso, concept_scheme_data
    concept_scheme_data.each do |cs_data|
      result = CreateConceptScheme.call({
                                          uri: cs_data[:origin].first,
                                          name: cs_data[:name],
                                          organization: dso
                                        })

      raise ConceptSchemeCreationError unless result.error.nil?
    end
  end
end
