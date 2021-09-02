# frozen_string_literal: true

require "faker"

# Factory for the Organization class
FactoryBot.define do
  factory :organization do
    name { Faker::Company.name }
    email { Faker::Internet.email }
    administrator { FactoryBot.build(:user) }

    association :configuration_profile, factory: :configuration_profile
  end
end
