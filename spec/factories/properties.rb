# frozen_string_literal: true

# == Schema Information
#
# Table name: properties
#
#  id              :bigint           not null, primary key
#  comment         :text
#  domain          :jsonb
#  label           :string
#  path            :string
#  range           :jsonb
#  scheme          :string
#  selected_domain :string
#  selected_range  :string
#  source_path     :string
#  source_uri      :string
#  subproperty_of  :string
#  uri             :string
#  value_space     :string
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  term_id         :bigint           not null
#
# Indexes
#
#  index_properties_on_term_id  (term_id)
#
# Foreign Keys
#
#  fk_rails_...  (term_id => terms.id) ON DELETE => cascade
#
require "faker"

FactoryBot.define do
  factory :property do
    source_uri { Faker::Lorem.sentence }
    subproperty_of { Faker::Lorem.sentence }
    value_space { Faker::Lorem.sentence }
    label { Faker::Lorem.sentence }
    comment { Faker::Lorem.sentence }
    domain { Faker::Lorem.sentence }
    range { Faker::Lorem.sentence }
    term
  end
end
