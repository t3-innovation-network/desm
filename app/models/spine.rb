# frozen_string_literal: true

# == Schema Information
#
# Table name: spines
#
#  id                            :bigint           not null, primary key
#  name                          :string
#  slug                          :string
#  configuration_profile_user_id :bigint           not null
#  domain_id                     :bigint
#
# Indexes
#
#  index_spines_on_configuration_profile_user_id  (configuration_profile_user_id)
#  index_spines_on_domain_id                      (domain_id)
#
# Foreign Keys
#
#  fk_rails_...  (configuration_profile_user_id => configuration_profile_users.id) ON DELETE => cascade
#  fk_rails_...  (domain_id => domains.id)
#
class Spine < ApplicationRecord
  include Slugable

  belongs_to :configuration_profile_user
  belongs_to :domain
  has_one :configuration_profile, through: :configuration_profile_user
  has_one :organization, through: :configuration_profile_user
  has_and_belongs_to_many :terms
  has_many :mappings
  has_many :properties, through: :terms

  before_destroy :check_if_mappings_exist

  def to_json_ld
    {
      name:,
      uri:,
      domain: domain.uri,
      terms: terms.map(&:uri).sort
    }
  end

  private

  def check_if_mappings_exist
    return if mappings.none?

    raise "Cannot remove a spine with existing mappings. " \
          "Please remove all mappings before removing the spine."
  end
end
