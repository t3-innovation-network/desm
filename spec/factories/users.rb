# frozen_string_literal: true

require "faker"

# Factory for the User class
FactoryBot.define do
  factory :user do
    fullname { Faker::Name.name }
    email { Faker::Internet.email }
    password { Faker::Internet.password }
    organization
  end
end
