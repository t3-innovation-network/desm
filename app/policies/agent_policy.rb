# frozen_string_literal: true

###
# @description: Represents the ability that a user has to access
#   agents records.
###
class AgentPolicy < AdminAccessPolicy
  class Scope < ApplicationPolicy::Scope
    def resolve
      return scope.none unless user.user.super_admin?

      User.joins(:roles).where(roles: { name: Desm::MAPPER_ROLE_NAME }).distinct
    end
  end
end
