# frozen_string_literal: true

# == Schema Information
#
# Table name: organizations
#
#  id               :bigint           not null, primary key
#  description      :text
#  email            :string           not null
#  homepage_url     :string
#  name             :string           not null
#  slug             :string
#  standards_page   :string
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  administrator_id :bigint
#
# Indexes
#
#  index_organizations_on_administrator_id  (administrator_id)
#
# Foreign Keys
#
#  fk_rails_...  (administrator_id => users.id)
#
require "rails_helper"

RSpec.describe Organization do
  let(:organization) { create(:organization) }

  it { is_expected.to validate_presence_of(:name) }

  it "gets the slug generated when saving and when changing name" do
    expect(organization.slug).not_to be_nil

    organization.update(name: "Something Else")
    expect(organization.slug).to eql "Something+Else"
  end
end
