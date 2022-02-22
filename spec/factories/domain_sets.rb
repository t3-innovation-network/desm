# frozen_string_literal: true

require "faker"

FactoryBot.define do
  factory :domain_set do
    title { Faker::App.name }
    source_uri { Faker::Internet.url }
    description { Faker::Lorem.sentence }
    creator { Faker::App.author }
  end
end
