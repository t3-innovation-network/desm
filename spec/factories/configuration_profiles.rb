# frozen_string_literal: true

require "faker"

FactoryBot.define do
  factory :configuration_profile do
    name { Faker::App.name }
    description { Faker::Lorem.sentence }
  end
end
