# frozen_string_literal: true

# == Schema Information
#
# Table name: specifications
#
#  id                            :bigint           not null, primary key
#  name                          :string           not null
#  selected_domains_from_file    :jsonb
#  slug                          :string
#  use_case                      :string
#  version                       :string
#  created_at                    :datetime         not null
#  updated_at                    :datetime         not null
#  configuration_profile_user_id :bigint           not null
#  domain_id                     :bigint           not null
#
# Indexes
#
#  index_specifications_on_configuration_profile_user_id  (configuration_profile_user_id)
#  index_specifications_on_domain_id                      (domain_id)
#
# Foreign Keys
#
#  fk_rails_...  (configuration_profile_user_id => configuration_profile_users.id) ON DELETE => cascade
#  fk_rails_...  (domain_id => domains.id)
#
require "faker"

FactoryBot.define do
  factory :specification do
    configuration_profile_user
    name { Faker::Name.unique.first_name }
    domain

    trait :with_terms do
      transient do
        terms_count { 1 }
      end

      after(:create) do |specification, evaluator|
        terms = create_list(:term, evaluator.terms_count,
                            configuration_profile_user: specification.configuration_profile_user)
        specification.terms << terms
      end
    end
  end
end
