# frozen_string_literal: true

require "faker"

FactoryBot.define do
  factory :configuration_profile do
    name { Faker::Name.unique.first_name }
    description { Faker::Lorem.sentence }
    json_abstract_classes { JSON.parse(File.read(Rails.root.join("concepts", "desmAbstractClasses.json"))) }
    json_mapping_predicates { JSON.parse(File.read(Rails.root.join("concepts", "desmMappingPredicates.json"))) }
  end
end
