# frozen_string_literal: true

require "faker"

# Factory for the Role class
FactoryBot.define do
  factory :role do
    name { Faker::Verb.base }
  end
end
