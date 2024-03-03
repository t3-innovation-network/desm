# frozen_string_literal: true

# == Schema Information
#
# Table name: roles
#
#  id         :bigint           not null, primary key
#  name       :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
require "faker"

# Factory for the Role class
FactoryBot.define do
  factory :role do
    name { Faker::Verb.base }

    trait :admin do
      name { DESM::ADMIN_ROLE_NAME.downcase.to_sym }
    end
  end
end
