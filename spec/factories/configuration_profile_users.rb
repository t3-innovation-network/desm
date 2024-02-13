# frozen_string_literal: true

# == Schema Information
#
# Table name: configuration_profile_users
#
#  id                       :bigint           not null, primary key
#  lead_mapper              :boolean          default(FALSE), not null
#  configuration_profile_id :bigint           not null
#  organization_id          :bigint           not null
#  user_id                  :bigint           not null
#
# Indexes
#
#  index_configuration_profile_user  (configuration_profile_id,user_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (configuration_profile_id => configuration_profiles.id) ON DELETE => cascade
#  fk_rails_...  (organization_id => organizations.id) ON DELETE => cascade
#  fk_rails_...  (user_id => users.id) ON DELETE => cascade
#
FactoryBot.define do
  factory :configuration_profile_user do
    configuration_profile
    organization
    user
  end
end
