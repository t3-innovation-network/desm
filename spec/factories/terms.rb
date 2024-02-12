# frozen_string_literal: true

# == Schema Information
#
# Table name: terms
#
#  id                            :bigint           not null, primary key
#  identifier                    :string
#  name                          :string
#  raw                           :json             not null
#  slug                          :string
#  source_uri                    :string           not null
#  created_at                    :datetime         not null
#  updated_at                    :datetime         not null
#  configuration_profile_user_id :bigint           not null
#
# Indexes
#
#  index_terms_on_configuration_profile_user_id  (configuration_profile_user_id)
#
# Foreign Keys
#
#  fk_rails_...  (configuration_profile_user_id => configuration_profile_users.id) ON DELETE => cascade
#
require "faker"

FactoryBot.define do
  factory :term do
    configuration_profile_user
    source_uri { Faker::Internet.url }
    name { Faker::Name.unique.first_name }
    raw do
      JSON.parse([
        "{\"id\":\"#{Faker::Name.unique.first_name}\"",
        "\"type\":\"rdf:Property\"",
        "\"label\":{\"en\":\"#{Faker::Quote.yoda}\"}",
        "\"domain\":[\"rdf:Property\", \"rdfs:Class\"]",
        "\"range\":\"rdf:langString\"",
        "\"isDefinedBy\":\"rdfs:\"}"
      ].join(","))
    end
  end
end
