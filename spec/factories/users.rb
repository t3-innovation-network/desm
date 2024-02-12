# frozen_string_literal: true

# == Schema Information
#
# Table name: users
#
#  id                     :bigint           not null, primary key
#  email                  :string           not null
#  fullname               :string           not null
#  github_handle          :string
#  password_digest        :string
#  phone                  :string
#  reset_password_sent_at :datetime
#  reset_password_token   :string
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  organization_id        :integer
#
# Indexes
#
#  index_users_on_email  (email) UNIQUE
#
require "faker"

FactoryBot.define do
  factory :user do
    fullname { Faker::Name.name }
    email { Faker::Internet.email }
    password { Faker::Internet.password(min_length: 10, max_length: 20, mix_case: true, special_characters: true) }
  end
end
