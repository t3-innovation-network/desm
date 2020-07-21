# frozen_string_literal: true

# Factory for the User class
FactoryBot.define do
  factory :user do
    email { "john@doe.com" }
    password { "johndoepass" }
  end
end
