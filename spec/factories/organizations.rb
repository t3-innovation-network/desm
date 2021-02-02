# frozen_string_literal: true

require "faker"

# Factory for the Organization class
FactoryBot.define do
  factory :organization do
    sequence(:id) {|number| number }
    name { Faker::Company.name }
    email { Faker::Internet.email }
  end
end
