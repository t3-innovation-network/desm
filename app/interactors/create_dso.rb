# frozen_string_literal: true

class DSOMapperCreationError < StandardError; end

class CreateDso
  include Interactor

  before do
    context.fail!(error: "configuration profile must be present") unless context.configuration_profile.present?
    context.fail!(error: "email must be present") unless context.email.present?
    context.fail!(error: "name must be present") unless context.name.present?
  end

  def call
    context.dso = Organization
                  .create_with(dso_attributes)
                  .find_or_create_by!(name: dso_attributes.fetch(:name))

    (context.dso_agents || []).each do |agent_data|
      create_agent(agent_data)
    end
  end

  private

  def create_agent(data)
    result = CreateAgent.call(
      data.merge(role: Role.find_by_name("mapper"), organization: context.dso)
    )
    raise DSOMapperCreationError.new("DSOMapperCreationError: #{result.error}") if result.error?

    context.dso.users << result.agent
  end

  def dso_attributes
    context.to_h.slice(
      :administrator,
      :configuration_profile,
      :description,
      :email,
      :homepage_url,
      :name,
      :standards_page
    )
  end
end
