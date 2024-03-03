# frozen_string_literal: true

class UserContext
  attr_reader :user, :configuration_profile, :configuration_profile_user

  def initialize(user, options = {})
    @user = user
    options.each_pair do |key, value|
      instance_variable_set("@#{key}", value)
    end
  end

  def organization
    @organization ||= configuration_profile_user&.organization
  end
end
