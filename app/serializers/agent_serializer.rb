# frozen_string_literal: true

# subset of user attributes
class AgentSerializer < ApplicationSerializer
  attributes :email, :fullname, :github_handle, :organization_id, :phone
  attribute :profiles, if: -> { params[:with_configuration_profiles] }

  attribute :name do
    object.fullname
  end

  # TODO: this need to be updated when we will have more roles
  def role
    Desm::MAPPER_ROLE_NAME
  end

  def profiles
    data = object.configuration_profile_users.includes(:configuration_profile, :organization).map do |profile_user|
      configuration_profile = profile_user.configuration_profile
      organization = profile_user.organization
      { id: profile_user.id,
        lead_mapper: profile_user.lead_mapper,
        configuration_profile: {
          name: configuration_profile.name, id: configuration_profile.id,
          state: configuration_profile.state
        },
        organization: {
          name: organization.name,
          id: organization.id
        } }
    end
    data.sort_by { |profile| profile[:organization][:name] }
  end
end
