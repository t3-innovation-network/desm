# frozen_string_literal: true

# == Schema Information
#
# Table name: spines
#
#  id                            :bigint           not null, primary key
#  name                          :string
#  slug                          :string
#  configuration_profile_user_id :bigint           not null
#  domain_id                     :bigint
#
# Indexes
#
#  index_spines_on_configuration_profile_user_id  (configuration_profile_user_id)
#  index_spines_on_domain_id                      (domain_id)
#
# Foreign Keys
#
#  fk_rails_...  (configuration_profile_user_id => configuration_profile_users.id) ON DELETE => cascade
#  fk_rails_...  (domain_id => domains.id)
#
require "faker"

FactoryBot.define do
  factory :spine do
    configuration_profile_user
    name { Faker::Name.unique.first_name }
    domain
  end
end
