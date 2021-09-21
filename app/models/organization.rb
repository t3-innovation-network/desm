# frozen_string_literal: true

###
# @description: Represents an organization in the application
###
class Organization < ApplicationRecord
  belongs_to :administrator, class_name: :User, foreign_key: "administrator_id"
  belongs_to :configuration_profile
  has_many :terms, dependent: :destroy
  has_many :users
  has_many :vocabularies, dependent: :destroy

  before_destroy :remove_agents

  validates :name, presence: true, uniqueness: true

  def agents
    users.where.not(id: administrator.id)
  end

  def mappings
    Mapping.where(user: users)
  end

  def remove_agents
    agents.each(&:destroy!)
  end

  def schemes
    Specification.where(user: users)
  end
end
