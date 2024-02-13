# frozen_string_literal: true

# == Schema Information
#
# Table name: vocabularies
#
#  id                       :bigint           not null, primary key
#  content                  :jsonb            not null
#  context                  :jsonb            not null
#  name                     :string           not null
#  created_at               :datetime         not null
#  updated_at               :datetime         not null
#  configuration_profile_id :bigint           not null
#
# Indexes
#
#  index_vocabularies_on_configuration_profile_id  (configuration_profile_id)
#
# Foreign Keys
#
#  fk_rails_...  (configuration_profile_id => configuration_profiles.id) ON DELETE => cascade
#
require "faker"

FactoryBot.define do
  factory :vocabulary do
    configuration_profile
    name { Faker::Name.name }
    content { Faker::Json.shallow_json(width: 3, options: { key: "Name.first_name", value: "Name.last_name" }) }
  end
end
