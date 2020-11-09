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
  # @return [TrueClass|FalseClass]
  ###
  def role?(role)
    roles.any? {|r| r.name.underscore.to_sym == role }
  end

  ###
  # @description: Assigns a role to a user
  # @param [Fixnum] role_id
  # @return [TrueClass|FalseClass]
  ###
  def assign_role(role_id)
    return false if Role.find(role_id) && !Assignment.where(user_id: id, role_id: role_id)
    return true if Assignment.create!(user_id: id, role_id: role_id)
  end

  ###
  # @description: Update a user's role
  # @param [Fixnum] role_id
  ###
  def update_role(role_id)
    assignment = Assignment.find_by_user_id(id)
    assignment.role_id = role_id
    assignment.save!
  end

  ###
  # @description: Include additional information about the specification in
  #   json responses. This overrides the ApplicationRecord as_json method.
  ###
  def as_json(_options={})
    super except: %i[created_at updated_at],
          include: %i[roles organization]
  end
end
