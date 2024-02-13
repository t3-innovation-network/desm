# frozen_string_literal: true

# == Schema Information
#
# Table name: rdfs_class_nodes
#
#  id         :bigint           not null, primary key
#  definition :jsonb
#  uri        :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_rdfs_class_nodes_on_uri  (uri) UNIQUE
#
require "faker"

FactoryBot.define do
  factory :rdfs_class_node do
    uri { Faker::Lorem.sentence }
    definition { Faker::Json.shallow_json(width: 3, options: { key: "Name.first_name", value: "Name.last_name" }) }
  end
end
