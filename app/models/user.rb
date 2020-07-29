# frozen_string_literal: true

###
# @description: Represents a user of this application
###
class User < ApplicationRecord
  has_secure_password

  validates_presence_of :email
  validates_uniqueness_of :email
end
