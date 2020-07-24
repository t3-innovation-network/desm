# frozen_string_literal: true

require "faker"

# Factory for the Assignment class
FactoryBot.define do
  factory :assignment do
    user { Faker.build(:user) }
    role { Faker.build(:role) }
  end
end
