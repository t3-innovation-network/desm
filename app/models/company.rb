# frozen_string_literal: true

###
# @description: Represents a company in the application
###
class Company < ApplicationRecord
  validates :name, presence: true, uniqueness: true
end
