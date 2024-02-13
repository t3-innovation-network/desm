# frozen_string_literal: true

# == Schema Information
#
# Table name: organizations
#
#  id               :bigint           not null, primary key
#  description      :text
#  email            :string           not null
#  homepage_url     :string
#  name             :string           not null
#  slug             :string
#  standards_page   :string
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  administrator_id :bigint
#
# Indexes
#
#  index_organizations_on_administrator_id  (administrator_id)
#
# Foreign Keys
#
#  fk_rails_...  (administrator_id => users.id)
#
require "faker"

# Factory for the Organization class
FactoryBot.define do
  factory :organization do
    name { Faker::Name.unique.first_name }
    email { Faker::Internet.email }
  end
end
