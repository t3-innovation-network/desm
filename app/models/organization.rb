# frozen_string_literal: true

###
# @description: Represents an organization in the application
###
class Organization < ApplicationRecord
  validates :name, presence: true, uniqueness: true
  belongs_to :configuration_profile
  has_many :users, dependent: :destroy
  has_many :vocabularies
  belongs_to :administrator, class_name: :User, foreign_key: "administrator_id"

  before_destroy :check_for_users, prepend: true

  private

  def check_for_users
    throw(:abort) if users.any?
  end
end
