# frozen_string_literal: true

FactoryBot.define do
  factory :alignment_vocabulary do
    alignment
    title { Faker::Lorem.sentence }
  end
end
