# frozen_string_literal: true

FactoryBot.define do
  factory :predicate_set do
    title { Faker::App.name }
    source_uri { Faker::Internet.url }
    description { Faker::Lorem.sentence }
    creator { Faker::App.author }
  end
end
