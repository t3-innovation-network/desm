# frozen_string_literal: true

class DashboardStatsQuery < BaseQuery
  def call
    {
      configuration_profiles:,
      mappings:
    }
  end

  private

  def associated_schemas_count_for(profile)
    (profile.structure["standards_organizations"] || []).map { |org| org["associated_schemas"]&.size || 0 }.sum
  end

  def configuration_profiles
    ConfigurationProfile.all.map do |profile|
      {
        id: profile.id,
        name: profile.name,
        state: profile.state,
        dsos_count: organization_count_for(profile),
        agents_count: agents_count_for(profile),
        associated_schemas_count: associated_schemas_count_for(profile)
      }
    end
  end

  def organization_count_for(profile)
    # TODO: uncomment when we will be sure on what is primary source for cp data
    # return profile.standards_organizations.count if profile.activated?
    profile.structure["standards_organizations"]&.size || 0
  end

  def agents_count_for(profile)
    # TODO: uncomment when we will be sure on what is primary source for cp data
    # return profile.configuration_profile_users.count if profile.activated?
    (profile.structure["standards_organizations"] || []).map { |org| org["dso_agents"]&.size || 0 }.sum
  end

  def mappings
    Mapping.all.group(:status).count
  end
end
