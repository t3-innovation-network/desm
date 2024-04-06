# frozen_string_literal: true

class AgentsQuery < BaseQuery
  def call
    apply_filters
    sorted_scope
  end

  private

  def apply_filters
    return if q.empty?

    @scope = scope.with_configuration_profiles
    @scope = scope.for_organizations(q.organization_ids) if q.organization_ids.present?
    @scope = scope.for_configuration_profiles(q.configuration_profile_ids) if q.configuration_profile_ids.present?
    @scope = scope.for_configuration_profile_states(q.configuration_profile_states) \
      if q.configuration_profile_states.present?

    return unless q.search.present?

    search_scope = with_joins? ? User.where(id: @scope.ids) : @scope
    @scope = search_scope.search_by_agents(q.search)
  end

  def sorted_scope
    # we need the `reorder("")` for this to work with DISTINCT
    # See more on: https://github.com/Casecommons/pg_search/issues/238
    scope.reorder("").order(fullname: :asc).distinct
  end

  def with_joins?
    q.organization_ids.present? || q.configuration_profile_ids.present? || q.configuration_profile_states.present?
  end
end
