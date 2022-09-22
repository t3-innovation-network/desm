# frozen_string_literal: true

require "faker"

FactoryBot.define do
  factory :vocabulary do
    configuration_profile
    name { Faker::Name.name }
    content { Faker::Json.shallow_json(width: 3, options: {key: "Name.first_name", value: "Name.last_name"}) }
  end
end
