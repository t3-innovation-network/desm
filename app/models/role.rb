# frozen_string_literal: true

###
# @description: Represents a role for a user in the application
###
class Role < ApplicationRecord
  validates :name, presence: true, uniqueness: true

  has_many :assignments
  has_many :users, through: :assignments
end
