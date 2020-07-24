# frozen_string_literal: true

require "rails_helper"

describe User, type: :model do
  let!(:user) { FactoryBot.build(:user) }

  it "has a valid factory" do
    expect(FactoryBot.build(:user)).to be_valid
  end

  it { should have_many(:assignments) }
  it { should have_many(:roles).through(:assignments) }
  it { should belong_to(:organization) }
  it { should validate_presence_of(:fullname) }

  it "should be an admin if we configure it that way" do
    user.roles << Role.new(name: "admin")

    expect(user.role?(:admin)).to be(true)
  end
end
