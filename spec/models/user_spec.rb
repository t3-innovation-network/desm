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
require "rails_helper"

RSpec.describe User do
  let!(:user) { build(:user) }

  it "validates and has associations", :aggregate_failures do
    is_expected.to validate_presence_of(:fullname)
    expect(subject).to have_many(:assignments)
    expect(subject).to have_many(:roles).through(:assignments)
  end

  it "is an admin if we configure it that way" do
    admin_role_name = Desm::ADMIN_ROLE_NAME

    user.roles << Role.create!(name: admin_role_name)

    expect(user.role?(admin_role_name.downcase.to_sym)).to be(true)
  end

  it "can not be created without an organization" do
    password = Faker::Internet.password(min_length: 10, max_length: 20, mix_case: true, special_characters: true)
    admin = described_class.create!(
      fullname: "test",
      email: "test@test.com",
      password:,
      skip_validating_organization: true
    )

    expect(admin).not_to be_nil
    expect do
      described_class.create!(
        fullname: "test",
        email: "test@test.com",
        password:
      )
    end.to raise_error ActiveRecord::RecordInvalid
  end
end
