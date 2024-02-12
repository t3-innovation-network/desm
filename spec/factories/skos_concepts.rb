# frozen_string_literal: true

# == Schema Information
#
# Table name: skos_concepts
#
#  id  :bigint           not null, primary key
#  raw :jsonb            not null
#  uri :string           not null
#
# Indexes
#
#  index_skos_concepts_on_uri  (uri) UNIQUE
#
FactoryBot.define do
  factory :skos_concept do
    raw { Faker::Json.shallow_json(width: 3) }
    uri { Faker::Internet.url }
  end
end
