# frozen_string_literal: true

require "rails_helper"

describe Organization, type: :model do
  it "has a valid factory" do
    expect(FactoryBot.build(:organization)).to be_valid
  end

  it { should validate_presence_of(:name) }
  it { should have_many(:users) }
end
