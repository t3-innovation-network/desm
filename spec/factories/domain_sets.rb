# frozen_string_literal: true

# == Schema Information
#
# Table name: domain_sets
#
#  id          :bigint           not null, primary key
#  creator     :string
#  description :text
#  slug        :string
#  source_uri  :string           not null
#  title       :string           not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#
# Indexes
#
#  index_domain_sets_on_source_uri  (source_uri)
#
require "faker"

FactoryBot.define do
  factory :domain_set do
    title { Faker::App.name }
    source_uri { Faker::Internet.url }
    description { Faker::Lorem.sentence }
    creator { Faker::App.author }
  end
end
