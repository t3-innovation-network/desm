# frozen_string_literal: true

###
# @description: Represents an organization in the application
###
class Organization < ApplicationRecord
  belongs_to :administrator, class_name: :User, foreign_key: "administrator_id", optional: true
  belongs_to :configuration_profile
  has_many :agents, ->(o) { where.not(id: o.administrator_id) }, class_name: "User", dependent: :destroy
  has_many :terms, dependent: :destroy
  has_many :users
  has_many :mappings, through: :users
  has_many :schemes, through: :users, source: :specifications
  has_many :vocabularies, dependent: :destroy

  validates :name, presence: true, uniqueness: true
end
