# frozen_string_literal: true

###
# @description: Represents an organization in the application
###
class Organization < ApplicationRecord
  belongs_to :administrator, class_name: :User, foreign_key: "administrator_id"
  belongs_to :configuration_profile
  has_many :agents, ->(o) { where.not(id: o.administrator_id) }, class_name: "User", dependent: :destroy
  has_many :terms, dependent: :destroy
  has_many :users
  has_many :mappings, through: :users
  has_many :schemes, through: :users, source: :specifications
  has_many :vocabularies, dependent: :destroy

  before_destroy :remove_agents

  validates :name, presence: true, uniqueness: true

  def remove_agents
    agents.each(&:destroy!)
  end
end
