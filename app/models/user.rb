# frozen_string_literal: true

###
# @description: Represents a user of this application
###
class User < ApplicationRecord
  has_secure_password

  belongs_to :organization

  validates_presence_of :fullname
  validates_presence_of :organization_id
  validates_presence_of :email
  validates_uniqueness_of :email
end
