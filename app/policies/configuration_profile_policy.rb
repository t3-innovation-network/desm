# frozen_string_literal: true

###
# @description: Represents the ability that a user has to access
#   configuration profiles records.
###
class ConfigurationProfilePolicy < AdminAccessPolicy
  class Scope < ApplicationPolicy::Scope
    def resolve
      return scope.all if user.user.super_admin?

      user.user.configuration_profiles
    end
  end
end
