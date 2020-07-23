# frozen_string_literal: true

###
# @description: Represents an organization in the application
###
class Organization < ApplicationRecord
  validates :name, presence: true, uniqueness: true
end
