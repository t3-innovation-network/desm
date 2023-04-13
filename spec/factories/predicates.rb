# frozen_string_literal: true

require "faker"

FactoryBot.define do
  factory :predicate do
    color { Faker::Color.hex_color }
    definition { Faker::Lorem.sentence }
    predicate_set
    pref_label { Faker::Lorem.word }
    source_uri { Faker::Internet.url }
    weight { 3.50 }
  end
end
