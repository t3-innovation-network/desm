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

###
# @description: A join model connecting users to configuration profiles (via organization)
###
class ConfigurationProfileUser < ApplicationRecord
  belongs_to :configuration_profile
  belongs_to :organization
  belongs_to :user
  has_many :mappings
  has_many :specifications
  has_many :spines
  has_many :terms
  has_many :vocabularies, through: :configuration_profile

  before_destroy :check_if_mappings_exist

  scope :for_configuration_profile, ->(cp) { where(configuration_profile: cp) }

  private

  def check_if_mappings_exist
    return if mappings.none?

    raise I18n.t("errors.config.configuration_profile_user.destroy", count: 1, message: user.fullname)
  end
end
