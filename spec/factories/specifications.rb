# frozen_string_literal: true

require "faker"

FactoryBot.define do
  factory :specification do
    name { Faker::App.name }
    uri { Faker::Lorem.sentence }
    user
    domain
  end
end
