# frozen_string_literal: true

require "faker"

FactoryBot.define do
  factory :rdfs_class_node do
    uri { Faker::Lorem.sentence }
    definition { Faker::Json.shallow_json(width: 3, options: {key: "Name.first_name", value: "Name.last_name"}) }
  end
end
