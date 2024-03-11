# frozen_string_literal: true

# == Schema Information
#
# Table name: users
#
#  id                     :bigint           not null, primary key
#  email                  :string           not null
#  fullname               :string           not null
#  github_handle          :string
#  password_digest        :string
#  phone                  :string
#  reset_password_sent_at :datetime
#  reset_password_token   :string
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  organization_id        :integer
#
# Indexes
#
#  index_users_on_email  (email) UNIQUE
#

###
# @description: Represents a user of this application
###
class User < ApplicationRecord
  include Tokenable

  attr_accessor :skip_sending_welcome_email, :skip_validating_organization

  has_secure_password
  has_many :configuration_profile_users
  has_many :configuration_profiles, through: :configuration_profile_users
  has_many :organizations, through: :configuration_profile_users
  has_many :assignments, dependent: :delete_all
  has_many :mappings, through: :configuration_profile_users
  has_many :roles, through: :assignments
  has_many :specifications, through: :configuration_profile_users
  has_many :vocabularies, through: :configuration_profile_users

  validates :fullname, presence: true
  validates :email, presence: true, uniqueness: true

  after_create :send_welcome_email, unless: :skip_sending_welcome_email
  after_save :update_configuration_profiles

  def as_json(options = {})
    super(options.merge(methods: %i(roles)))
  end

  def assign_role(role_id)
    return false if Role.find(role_id) && !Assignment.where(user_id: id, role_id:)

    true if Assignment.create!(user_id: id, role_id:)
  end

  def available_domains
    configuration_profile&.domains
  end

  def available_predicates
    configuration_profile&.mapping_predicates&.predicates
  end

  def generate_password_token!
    update_columns(
      reset_password_token: generate_token(:reset_password_token),
      reset_password_sent_at: Time.now.utc
    )
  end

  def password_token_valid?
    reset_password_sent_at >= 3.days.ago
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
    roles.any? { |r| r.name.underscore.to_sym.eql?(role.to_s.underscore.to_sym) }
  end

  def send_reset_password_instructions
    UserMailer.with(user: self).forgot_pass.deliver_now
  end

  def send_welcome_email
    UserMailer.with(user: self).welcome.deliver_now
  end

  def super_admin?
    role?(Desm::ADMIN_ROLE_NAME.downcase.to_sym)
  end

  def update_role(role_id)
    assignment = Assignment.find_by_user_id(id)
    assignment.role_id = role_id
    assignment.save!
  end

  def update_configuration_profiles
    previous_email, current_email = previous_changes["email"]
    return if previous_email == current_email

    configuration_profiles.each do |cp|
      structure = cp.structure

      structure.fetch("standards_organizations", []).each do |o|
        o.fetch("dso_agents", []).each do |u|
          next unless u["email"] == previous_email

          u["email"] = current_email
        end
      end

      cp.update_column(:structure, structure)
    end
  end
end
