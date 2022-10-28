# frozen_string_literal: true

FactoryBot.define do
  factory :skos_concept do
    raw { Faker::Json.shallow_json(width: 3) }
    uri { Faker::Internet.url }
  end
end
