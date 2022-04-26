# frozen_string_literal: true

###
# @description: Represents a user of this application
###
class User < ApplicationRecord
  attr_accessor :skip_sending_welcome_email, :skip_validating_organization

  has_secure_password
  belongs_to :organization, optional: true
  has_many :assignments, dependent: :delete_all
  has_many :roles, through: :assignments
  has_many :mappings, dependent: :destroy
  has_many :specifications, dependent: :destroy

  validates :fullname, presence: true
  validates :email, presence: true, uniqueness: true
  validates :organization, presence: true, unless: :skip_validating_organization

  after_create :send_welcome_email, unless: :skip_sending_welcome_email

  def as_json(options={})
    super options.merge(methods: %i[roles organization])
  end

  def assign_role(role_id)
    return false if Role.find(role_id) && !Assignment.where(user_id: id, role_id: role_id)
    return true if Assignment.create!(user_id: id, role_id: role_id)
  end

  def available_domains
    profile_admin? || super_admin? ? Domain.all : organization.configuration_profile.abstract_classes.domains
  end

  def available_predicates
    profile_admin? || super_admin? ? Predicate.all : organization.configuration_profile.mapping_predicates.predicates
  end

  def generate_password_token!
    update_columns(
      reset_password_token: generate_token,
      reset_password_sent_at: Time.now.utc
    )
  end

  def password_token_valid?
    (reset_password_sent_at + 4.hours) > Time.now.utc
  end

  def profile_admin?
    role?(:"profile admin")
  end

  def reset_password!(password)
    self.skip_validating_organization = true if role?(Desm::ADMIN_ROLE_NAME)
    self.reset_password_token = nil
    self.password = password
    self.password_confirmation = password
    save!
  end

  def role?(role)
    roles.any? {|r| r.name.underscore.to_sym.eql?(role.to_s.underscore.to_sym) }
  end

  def send_reset_password_instructions
    UserMailer.with(user: self).forgot_pass.deliver_later
  end

  def send_welcome_email
    UserMailer.with(user: self).welcome.deliver_later
  end

  def super_admin?
    role?(:"super admin")
  end

  def update_role(role_id)
    assignment = Assignment.find_by_user_id(id)
    assignment.role_id = role_id
    assignment.save!
  end
end
