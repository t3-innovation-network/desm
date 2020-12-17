# frozen_string_literal: true

###
# @description: Represents a user of this application
###
class User < ApplicationRecord
  ###
  # @description: Generates the password_digest to ensure it's stored in a secure way
  ###
  has_secure_password
  ###
  # @description: The organization the user belongs to
  ###
  belongs_to :organization
  ###
  # @description: We can assign roles to the user
  ###
  has_many :assignments, dependent: :delete_all
  ###
  # @description: The user's roles
  ###
  has_many :roles, through: :assignments
  ###
  # @description: It should have a fullname
  ###
  validates_presence_of :fullname
  ###
  # @description: It should be part of an organization
  ###
  validates_presence_of :organization_id
  ###
  # @description: Email should be present
  ###
  validates_presence_of :email
  ###
  # @description: Email should be unique
  ###
  validates_uniqueness_of :email
  ###
  # @description: Send a welcome email to the user after creation
  ###
  after_create :send_welcome
  ###
  # @description: Generates secure, unique tokens
  ###
  include Tokenable
  ###
  # @description: Added because Tokenable needs the model that inclides it to have a "token" named attribute
  ###
  alias_attribute :token, :reset_password_token

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
  # @description: Creates a token to rset the password of this user
  ###
  def generate_password_token!
    update_columns(
      reset_password_token: generate_token,
      reset_password_sent_at: Time.now.utc
    )
  end

  ###
  # @description: Notify the user on how to reset the password
  ###
  def send_reset_password_instructions
    UserMailer.with(user: self).forgot_pass.deliver_now
  end

  ###
  # @description: Determines the validity of this user's password token
  ###
  def password_token_valid?
    (reset_password_sent_at + 4.hours) > Time.now.utc
  end

  ###
  # @description: Welcomes the user with an email which let's him sign in with
  #   a new password.
  ###
  def send_welcome
    UserMailer.with(user: self).welcome.deliver_now
  end

  ###
  # @description: Update a user's password
  # @param password [String]
  ###
  def reset_password!(password)
    self.reset_password_token = nil
    self.password = password
    self.password_confirmation = password
    save!
  end

  ###
  # @description: Include additional information about the specification in
  #   json responses. This overrides the ApplicationRecord as_json method.
  ###
  def as_json(options={})
    super options.merge(methods: %i[roles organization])
  end
end
