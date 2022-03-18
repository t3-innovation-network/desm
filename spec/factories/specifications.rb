# frozen_string_literal: true

require "faker"

FactoryBot.define do
  factory :specification do
    name { Faker::Name.unique.first_name }
    user
    domain

    after(:create) do |spec|
      terms = FactoryBot.create_list(:term, 10)
      spec.terms = terms
    end
  end
end
