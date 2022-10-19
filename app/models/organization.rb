# frozen_string_literal: true

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
      uri: uri,
      email: email,
      configurationProfile: configuration_profile.uri,
      name: name,
      created_at: created_at
    }
  end
end
