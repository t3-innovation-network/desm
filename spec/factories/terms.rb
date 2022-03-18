# frozen_string_literal: true

require "faker"

FactoryBot.define do
  factory :term do
    source_uri { Faker::Internet.url }
    name { Faker::Name.unique.first_name }
    raw {
      JSON.parse([
        "{\"id\":\"#{Faker::Name.unique.first_name}\"",
        "\"type\":\"rdf:Property\"",
        "\"label\":{\"en\":\"#{Faker::Quote.yoda}\"}",
        "\"domain\":[\"rdf:Property\", \"rdfs:Class\"]",
        "\"range\":\"rdf:langString\"",
        "\"isDefinedBy\":\"rdfs:\"}"
      ].join(","))
    }
    organization
  end
end
