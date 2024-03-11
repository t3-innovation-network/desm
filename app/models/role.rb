# frozen_string_literal: true

# == Schema Information
#
# Table name: roles
#
#  id         :bigint           not null, primary key
#  name       :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

###
# @description: Represents a role for a user in the application
###
class Role < ApplicationRecord
  has_many :assignments, dependent: :destroy
  has_many :users, through: :assignments

  validates :name, presence: true, uniqueness: { case_sensitive: false }

  before_save { name.downcase! }
end
