# frozen_string_literal: true

###
# @description: Represents the ability that a user has to access
#   configuration profiles records.
###
class ConfigurationProfilePolicy < AdminAccessPolicy
  def index?
    signed_in? && admin_role?
  end

  def index_shared_mappings?
    signed_in?
  end

  def index_for_user?
    signed_in?
  end

  def show?
    signed_in?
  end

  def set_current?
    signed_in?
  end

  class Scope < ApplicationPolicy::Scope
    def resolve
      return scope.all if user.user.super_admin?

      user.user.configuration_profiles
    end
  end
end
