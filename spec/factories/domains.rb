# frozen_string_literal: true

# == Schema Information
#
# Table name: domains
#
#  id            :bigint           not null, primary key
#  definition    :text
#  pref_label    :string           not null
#  slug          :string
#  source_uri    :string           not null
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  domain_set_id :bigint           not null
#
# Indexes
#
#  index_domains_on_domain_set_id                 (domain_set_id)
#  index_domains_on_domain_set_id_and_pref_label  (domain_set_id,pref_label) UNIQUE
#  index_domains_on_domain_set_id_and_source_uri  (domain_set_id,source_uri) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (domain_set_id => domain_sets.id) ON DELETE => cascade
#
require "faker"

FactoryBot.define do
  factory :domain do
    sequence(:pref_label) { |n| "#{Faker::App.name} #{n}" }
    definition { Faker::Lorem.sentence }
    source_uri { Faker::Lorem.sentence }
    domain_set

    trait :with_spine do
      after(:create) do |domain|
        create(:spine, domain:)
      end
    end
  end
end
