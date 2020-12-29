# frozen_string_literal: true

###
# @description: Represents a user of this application
###
class User < ApplicationRecord
  attr_accessor :skip_sending_welcome_email

  ###
  # INCLUSIONS
  ###

  ###
  # @description: Generates the password_digest to ensure it's stored in a secure way
  ###
  has_secure_password
  ###
  # @description: Generates secure, unique tokens
  ###
  include Tokenable
  ###
  # @description: Added because Tokenable needs the model that inclides it to have a "token" named attribute
  ###
  alias_attribute :token, :reset_password_token

  ###
  # RELATIONSHIPS
  ###

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
  # VALIDATIONS
  ###

  ###
  # @description: It should have a fullname
  ###
  validates :fullname, presence: true
  ###
  # @description: It should be part of an organization
  ###
  validates :organization_id, presence: true
  ###
  # @description: Email should be present
  ###
  validates :email, presence: true, uniqueness: true
  ###
  # @description: Rules to use in the password_strength policy
  ###
  PASSWORD_VALIDATION_RULES = {
    ###
    # @description: Level of deductibility. 18 is the library's default, known as an acceptable level
    #   of entropy.
    ###
    min_entropy: 15,
    ###
    # @description: The mimimum acceptable length of the password.
    ###
    min_word_length: MIN_PASSWORD_LENGTH,
    ###
    # @description: Use a dictionary to improve the validation of the password.
    ###
    use_dictionary: true
  }.freeze
  ###
  # @description: Uses entropy based password validation
  ###
  validates :password, password_strength: PASSWORD_VALIDATION_RULES

  ###
  # CALLBACKS
  ###

  ###
  # @description: Send a welcome email to the user after creation
  ###
  after_create :send_welcome_email, unless: :skip_sending_welcome_email

  ###
  # METHODS
  ###

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
    UserMailer.with(user: self).forgot_pass.deliver_later
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
  def send_welcome_email
    UserMailer.with(user: self).welcome.deliver_later
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
