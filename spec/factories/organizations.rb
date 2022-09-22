# frozen_string_literal: true

require "faker"

# Factory for the Organization class
FactoryBot.define do
  factory :organization do
    name { Faker::Name.unique.first_name }
    email { Faker::Internet.email }
  end
end
