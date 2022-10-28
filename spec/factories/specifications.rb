# frozen_string_literal: true

require "faker"

FactoryBot.define do
  factory :specification do
    configuration_profile_user
    name { Faker::Name.unique.first_name }
    domain
  end
end
