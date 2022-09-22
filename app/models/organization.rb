# frozen_string_literal: true

###
# @description: Represents an organization in the application
###
class Organization < ApplicationRecord
  include Slugable

  belongs_to :administrator, class_name: :User, foreign_key: "administrator_id", optional: true
  has_many :agents, ->(o) { where.not(id: o.administrator_id) }, class_name: "User", dependent: :destroy
  has_many :configuration_profile_users
  has_many :terms, dependent: :destroy
  has_many :spines, dependent: :destroy
  has_many :vocabularies, dependent: :destroy
  has_many :configuration_profiles, through: :configuration_profile_users
  has_many :users, through: :configuration_profile_users
  has_many :mappings, through: :users, dependent: :destroy

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
