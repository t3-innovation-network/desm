# frozen_string_literal: true

###
# @description: Represents an organization in the application
###
class Organization < ApplicationRecord
  validates :name, presence: true, uniqueness: true
  has_many :users, dependent: :destroy

  before_destroy :check_for_users, prepend: true

  private

  ###
  # @description: Check the existence of users related to this organization and
  #   abort if there's any
  ###
  def check_for_users
    throw(:abort) if users.any?
  end
end
