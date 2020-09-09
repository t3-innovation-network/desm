# frozen_string_literal: true

require "faker"

FactoryBot.define do
  factory :mapping_term do
    uri { Faker::Lorem.sentence }
    comment { Faker::Lorem.sentence }
    mapping
    predicate
  end
end
