# frozen_string_literal: true

require "faker"

FactoryBot.define do
  factory :property do
    source_uri { Faker::Lorem.sentence }
    subproperty_of { Faker::Lorem.sentence }
    value_space { Faker::Lorem.sentence }
    label { Faker::Lorem.sentence }
    comment { Faker::Lorem.sentence }
    domain { Faker::Lorem.sentence }
    range { Faker::Lorem.sentence }
    term
  end
end
