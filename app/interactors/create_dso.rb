# frozen_string_literal: true

class DSOMapperCreationError < StandardError; end

class CreateDso
  include Interactor

  delegate :active?, to: :configuration_profile
  delegate :configuration_profile, :dso, to: :context

  before do
    context.fail!(error: "configuration profile must be present") unless context.configuration_profile.present?
    context.fail!(error: "email must be present") unless context.email.present?
    context.fail!(error: "name must be present") unless context.name.present?
  end

  def call
    context.dso = Organization
                    .create_with(dso_attributes)
                    .find_or_create_by!(name: dso_attributes.fetch(:name))

    assign_configuration_profile
    create_agents
    dso
  end

  private

  def assign_administrator
    return if context.configuration_profile.administrator_id?

    context
      .configuration_profile
      .update_column(:administrator_id, context.agents.first&.id)
  end

  def assign_configuration_profile
    if configuration_profile.standards_organizations.include?(dso)
      raise "Multiple organizations named '#{dso.name}' found" unless active?

      return
    end

    configuration_profile.standards_organizations << dso
  end

  def assign_organization(agent, lead_mapper:)
    configuration_profile_user = configuration_profile
                                   .configuration_profile_users
                                   .find_or_initialize_by(user: agent)

    if configuration_profile_user.organization && configuration_profile_user.organization != dso
      raise "Multiple users with #{agent.email} email address found"
    end

    configuration_profile_user.lead_mapper = !lead_mapper.nil?
    configuration_profile_user.organization = dso
    configuration_profile_user.save!
  end

  def create_agent(data)
    result = CreateAgent.call(data.merge(role: Role.find_by_name("mapper")))
    raise DSOMapperCreationError, "DSOMapperCreationError: #{result.error}" if result.error?

    assign_organization(result.agent, lead_mapper: data["lead_mapper"])
    result.agent
  end

  def create_agents
    context.agents = (context.dso_agents || []).map do |agent_data|
      create_agent(agent_data)
    end
  end

  def dso_attributes
    context.to_h.slice(
      :administrator,
      :description,
      :email,
      :homepage_url,
      :name,
      :standards_page
    )
  end
end
