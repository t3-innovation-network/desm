# frozen_string_literal: true

require "rails_helper"

describe Role, type: :model do
  it "has a valid factory" do
    expect(FactoryBot.build(:role)).to be_valid
  end

  it { should validate_presence_of(:name) }
  it { should validate_uniqueness_of(:name) }

  it { should have_many(:assignments) }
  it { should have_many(:users).through(:assignments) }
end
