# frozen_string_literal: true

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
  has_many :vocabularies
end
