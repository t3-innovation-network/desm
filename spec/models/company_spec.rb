# frozen_string_literal: true

require "rails_helper"

describe Company, type: :model do
  it "has a valid factory" do
    expect(FactoryBot.build(:company)).to be_valid
  end

  it { should validate_presence_of(:name) }
end
