# frozen_string_literal: true

require "faker"

FactoryBot.define do
  factory :term do
    name { Faker::App.name }
    slug { Faker::App.name }
    raw {
      Faker::Json.shallow_json(
        width: 3,
        options: {
          key: "Verb.simple_present",
          value: "Quote.yoda"
        }
      )
    }
    organization
  end
end
