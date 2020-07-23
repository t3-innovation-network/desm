# frozen_string_literal: true

###
# @description: Represents a user of this application
###
class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  has_many :assignments, dependent: :delete_all
  has_many :roles, through: :assignments
  belongs_to :organization

  validates :fullname, presence: true

  ###
  # @description: Validates whether a user has or not a given role
  # @param [Symbol] role
  # @return [TrueClass]
  ###
  def role?(role)
    roles.any? {|r| r.name.underscore.to_sym == role }
  end
end
