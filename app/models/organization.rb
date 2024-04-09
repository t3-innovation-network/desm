# frozen_string_literal: true

# == Schema Information
#
# Table name: organizations
#
#  id               :bigint           not null, primary key
#  description      :text
#  email            :string           not null
#  homepage_url     :string
#  name             :string           not null
#  slug             :string
#  standards_page   :string
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  administrator_id :bigint
#
# Indexes
#
#  index_organizations_on_administrator_id  (administrator_id)
#
# Foreign Keys
#
#  fk_rails_...  (administrator_id => users.id)
#

###
# @description: Represents an organization in the application
###
class Organization < ApplicationRecord
  include Slugable

  belongs_to :administrator, class_name: :User, foreign_key: "administrator_id", optional: true
  has_many :agents, ->(o) { where.not(id: o.administrator_id) }, class_name: "User", dependent: :destroy
  has_many :configuration_profile_users
  has_many :terms, through: :configuration_profile_users
  has_many :spines, through: :configuration_profile_users
  has_many :users, through: :configuration_profile_users
  has_many :mappings, through: :configuration_profile_users
  has_and_belongs_to_many :configuration_profiles

  def to_json_ld
    {
      uri:,
      email:,
      configurationProfile: configuration_profile.uri,
      name:,
      created_at:
    }
  end
end
