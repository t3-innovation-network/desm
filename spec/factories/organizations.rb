# frozen_string_literal: true

require "faker"

# Factory for the Organization class
FactoryBot.define do
  factory :organization do
    name { Faker::Company.name }
  end
end
