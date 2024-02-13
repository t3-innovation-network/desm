# frozen_string_literal: true

# == Schema Information
#
# Table name: terms
#
#  id                            :bigint           not null, primary key
#  identifier                    :string
#  name                          :string
#  raw                           :json             not null
#  slug                          :string
#  source_uri                    :string           not null
#  created_at                    :datetime         not null
#  updated_at                    :datetime         not null
#  configuration_profile_user_id :bigint           not null
#
# Indexes
#
#  index_terms_on_configuration_profile_user_id  (configuration_profile_user_id)
#
# Foreign Keys
#
#  fk_rails_...  (configuration_profile_user_id => configuration_profile_users.id) ON DELETE => cascade
#
require "rails_helper"

describe Term do
  it "validates and has associations", :aggregate_failures do
    is_expected.to validate_presence_of(:name)
    is_expected.to validate_presence_of(:raw)
    is_expected.to have_and_belong_to_many(:specifications)
  end
end
