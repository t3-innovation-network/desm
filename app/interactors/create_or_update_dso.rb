# frozen_string_literal: true

class DSOMapperCreationError < StandardError; end

class CreateOrUpdateDso
  include Interactor
  include UniquenessValidatable

  delegate :active?, to: :configuration_profile
  delegate :configuration_profile, :dso, to: :context

  before do
    context.fail!(error: "configuration profile must be present") unless context.configuration_profile.present?
    context.fail!(error: "email must be present") unless context.email.present?
    context.fail!(error: "name must be present") unless context.name.present?
    repeated_agents = check_uniqueness_for((context.dso_agents || []).map { |agent| agent["email"] })
    if repeated_agents.any?
      error = I18n.t("errors.config.configuration_profile_user.update", count: repeated_agents.size,
                                                                        message: repeated_agents.join(", "))
      context.fail!(error:)
    end
  end

  def call
    ActiveRecord::Base.transaction do
      context.dso = Organization.find_or_initialize_by(name: dso_attributes.fetch(:name))
      context.dso.update!(context.dso.persisted? ? dso_attributes.except(:administrator) : dso_attributes)

      assign_configuration_profile
      create_agents
      clean_not_existing_agents
    end
  rescue ActiveRecord::RecordInvalid => e
    context.fail!(error: e.record.errors.full_messages.join(", "))
  rescue StandardError => e
    context.fail!(error: e.message)
  end

  private

  # TODO: looks like we're not using this method and it should be removed
  def assign_administrator
    return if context.configuration_profile.administrator_id?

    context
      .configuration_profile
      .update_column(:administrator_id, context.agents.first&.id)
  end

  def assign_configuration_profile
    if configuration_profile.standards_organizations.include?(dso)
      raise ArgumentError, "Multiple organizations named '#{dso.name}' found" unless active?

      return
    end

    configuration_profile.standards_organizations << dso
  end

  def assign_organization(agent, lead_mapper:)
    configuration_profile_user = configuration_profile
                                   .configuration_profile_users
                                   .find_or_initialize_by(user: agent)

    if configuration_profile_user.organization && configuration_profile_user.organization != dso
      raise ArgumentError, "Multiple users with #{agent.email} email address found"
    end

    configuration_profile_user.lead_mapper = !lead_mapper.nil?
    configuration_profile_user.organization = dso
    configuration_profile_user.save!
  end

  def clean_not_existing_agents
    # destroy not existing agents
    agent_ids = context.agents.map(&:id)
    dso.configuration_profile_users.for_configuration_profile(configuration_profile).each do |cpu|
      cpu.destroy unless agent_ids.include?(cpu.user_id)
    end
  end

  def create_agent(data)
    result = CreateOrUpdateAgent.call(data.merge(role: Role.find_by_name(Desm::MAPPER_ROLE_NAME)))
    raise DSOMapperCreationError, "DSOMapperCreationError: #{result.error}" unless result.success?

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
      :administrator, # TODO: looks like we don't have this parameter at UI and it should be removed
      :description,
      :email,
      :homepage_url,
      :name,
      :standards_page
    )
  end
end
