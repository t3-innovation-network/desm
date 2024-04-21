# frozen_string_literal: true

module Resources
  class ConfigurationProfilePolicy < AdminAccessPolicy
    class Scope < ApplicationPolicy::Scope
      def resolve
        return scope.all if user.user.super_admin?

        user.user.configuration_profiles
      end
    end
  end
end
