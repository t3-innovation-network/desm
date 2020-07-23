# frozen_string_literal: true

require "rails_helper"

describe Assignment, type: :model do
  it "has a valid factory" do
    expect(FactoryBot.build(:organization)).to be_valid
  end

  it { should belong_to(:user) }
  it { should belong_to(:role) }
end
