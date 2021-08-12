# frozen_string_literal: true

require "faker"

FactoryBot.define do
  factory :specification do
    name { Faker::App.name }
    uri { Faker::Lorem.sentence }
    user
    domain
    with_terms

    trait :with_terms do
      after(:build) do |spec|
        spec.terms = FactoryBot.build_list(:term, 10)
        spec.save
      end
    end
  end
end
