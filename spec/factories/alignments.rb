# frozen_string_literal: true

require "faker"

FactoryBot.define do
  factory :alignment do
    uri { Faker::Lorem.sentence }
    comment { Faker::Lorem.sentence }
    mapping
    predicate
  end
end
