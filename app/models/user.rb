# frozen_string_literal: true

###
# @description: Represents a user of this application
###
class User < ApplicationRecord
  has_secure_password

  belongs_to :organization
  has_many :assignments, dependent: :delete_all
  has_many :roles, through: :assignments

  validates_presence_of :fullname
  validates_presence_of :organization_id
  validates_presence_of :email
  validates_uniqueness_of :email

  ###
  # @description: Validates whether a user has or not a given role
  # @param [Symbol] role
  # @return [TrueClass]
  ###
  def role?(role)
    roles.any? {|r| r.name.underscore.to_sym == role }
  end
end
