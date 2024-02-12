# frozen_string_literal: true

###
# @description: Represents a role for a user in the application
###
class Role < ApplicationRecord
  has_many :assignments
  has_many :users, through: :assignments

  validates :name, presence: true, uniqueness: { case_sensitive: false }

  before_save { name.downcase! }
end
