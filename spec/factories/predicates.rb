# frozen_string_literal: true

require "faker"

FactoryBot.define do
  factory :predicate do
    pref_label { Faker::App.name }
    definition { "MyText" }
    source_uri { Faker::Lorem.sentence }
  end
end
