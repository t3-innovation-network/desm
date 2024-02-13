# frozen_string_literal: true

# == Schema Information
#
# Table name: predicate_sets
#
#  id                 :bigint           not null, primary key
#  creator            :string
#  description        :text
#  slug               :string
#  source_uri         :string           not null
#  title              :string           not null
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  strongest_match_id :bigint
#
# Indexes
#
#  index_predicate_sets_on_strongest_match_id  (strongest_match_id)
#
# Foreign Keys
#
#  fk_rails_...  (strongest_match_id => predicates.id)
#
FactoryBot.define do
  factory :predicate_set do
    title { Faker::App.name }
    source_uri { Faker::Internet.url }
    description { Faker::Lorem.sentence }
    creator { Faker::App.author }
  end
end
