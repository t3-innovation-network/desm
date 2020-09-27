# frozen_string_literal: true

require "faker"

FactoryBot.define do
  factory :term do
    name { Faker::App.name }
    uri { Faker::Lorem.sentence }
    specification
  end
end
