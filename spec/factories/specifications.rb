# frozen_string_literal: true

require "faker"

FactoryBot.define do
  factory :specification do
    name { Faker::App.name }
    user
    domain

    after(:build) do |spec|
      FactoryBot.build_list(:term, 10).each do |term|
        spec.terms << term
      end
    end
  end
end
