# frozen_string_literal: true

require "faker"

FactoryBot.define do
  factory :mapping do
    name { Faker::App.name }
    title { Faker::App.name }
    description { Faker::Lorem.sentence }
    user
    with_spine_and_spec

    trait :with_spine_and_spec do
      spine { FactoryBot.build(:specification) }
      specification { FactoryBot.build(:specification) }
    end
  end
end
