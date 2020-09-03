# frozen_string_literal: true

require "faker"

FactoryBot.define do
  factory :domain do
    pref_label { Faker::App.name }
    definition { "MyText" }
    uri { Faker::Lorem.sentence }
    domain_set
  end
end
