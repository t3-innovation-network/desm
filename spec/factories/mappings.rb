# frozen_string_literal: true

require "faker"

FactoryBot.define do
  factory :mapping do
    name { Faker::App.name }
    title { Faker::App.name }
    description { Faker::Lorem.sentence }
    user
    association :spine, factory: :specification
    association :specification, factory: :specification
  end
end
