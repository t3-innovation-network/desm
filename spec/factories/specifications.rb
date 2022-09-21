# frozen_string_literal: true

require "faker"

FactoryBot.define do
  factory :specification do
    configuration_profile_user
    name { Faker::Name.unique.first_name }
    domain

    after(:create) do |spec|
      terms = FactoryBot.create_list(:term, 10)
      spec.terms = terms
    end
  end
end
