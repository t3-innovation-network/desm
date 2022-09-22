# frozen_string_literal: true

FactoryBot.define do
  factory :configuration_profile_user do
    configuration_profile
    organization
    user
  end
end
