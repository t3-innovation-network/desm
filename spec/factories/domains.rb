# frozen_string_literal: true

require "faker"

FactoryBot.define do
  factory :domain do
    pref_label { Faker::App.name }
    definition { Faker::Lorem.sentence }
    uri { Faker::Lorem.sentence }
    domain_set
  end
end
