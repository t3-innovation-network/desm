# frozen_string_literal: true

require "faker"

FactoryBot.define do
  factory :mapping do
    configuration_profile_user
    name { Faker::App.name }
    title { Faker::App.name }
    description { Faker::Lorem.sentence }
    spine
    specification do
      create(
        :specification,
        configuration_profile_user: configuration_profile_user
      )
    end
  end
end
