# frozen_string_literal: true

require "rails_helper"

RSpec.describe User, type: :model do
  let!(:user) { FactoryBot.build(:user) }

  it "has a valid factory" do
    expect(FactoryBot.build(:user)).to be_valid
  end

  it { should have_many(:assignments) }
  it { should have_many(:roles).through(:assignments) }
  it { should validate_presence_of(:fullname) }

  it "should be an admin if we configure it that way" do
    admin_role_name = Desm::ADMIN_ROLE_NAME

    user.roles << Role.create!(name: admin_role_name)

    expect(user.role?(admin_role_name.downcase.to_sym)).to be(true)
  end

  it "can not be created without an organization" do
    password = Faker::Internet.password(min_length: 10, max_length: 20, mix_case: true, special_characters: true)
    admin = User.create!(
      fullname: "test",
      email: "test@test.com",
      password: password,
      skip_validating_organization: true
    )

    expect(admin).not_to be_nil
    expect do
      User.create!(
        fullname: "test",
        email: "test@test.com",
        password: password
      )
    end.to raise_error ActiveRecord::RecordInvalid
  end
end
