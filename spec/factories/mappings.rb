# frozen_string_literal: true

require "faker"

FactoryBot.define do
  factory :mapping do
    name { Faker::App.name }
    title { Faker::App.name }
    description { Faker::Lorem.sentence }
    user
    specification
    with_spine

    trait :with_spine do
      spine { Specification.new }
    end
  end
end
