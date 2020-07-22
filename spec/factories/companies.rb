# frozen_string_literal: true

require "faker"

# Factory for the Company class
FactoryBot.define do
  factory :company do
    name { Faker::Company.name }
  end
end
