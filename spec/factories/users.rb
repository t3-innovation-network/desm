# frozen_string_literal: true

require "faker"

# Factory for the User class
FactoryBot.define do
  factory :user do
    email { Faker::Internet.email }
    password { Faker::Internet.password }
  end
end
