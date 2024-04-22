# frozen_string_literal: true

# == Schema Information
#
# Table name: predicates
#
#  id               :bigint           not null, primary key
#  color            :string
#  definition       :text
#  pref_label       :string
#  slug             :string
#  source_uri       :string
#  weight           :float            default(0.0), not null
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  predicate_set_id :bigint
#
# Indexes
#
#  index_predicates_on_predicate_set_id                 (predicate_set_id)
#  index_predicates_on_predicate_set_id_and_pref_label  (predicate_set_id,pref_label) UNIQUE
#  index_predicates_on_predicate_set_id_and_source_uri  (predicate_set_id,source_uri) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (predicate_set_id => predicate_sets.id) ON DELETE => cascade
#
require "faker"

FactoryBot.define do
  factory :predicate do
    color { Faker::Color.hex_color }
    definition { Faker::Lorem.sentence }
    predicate_set
    pref_label { Faker::Lorem.word }
    source_uri { Faker::Internet.url }
    weight { 3.50 }

    trait :nomatch do
      source_uri { "http://example.com/nomatch" }
    end
  end
end
