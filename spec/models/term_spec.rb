# frozen_string_literal: true

require "rails_helper"

describe Term, type: :model do
  it "has a valid factory" do
    expect(FactoryBot.build(:term)).to be_valid
  end

  it { should validate_presence_of(:name) }
  it { should validate_presence_of(:raw) }
  it { should have_and_belong_to_many(:specifications) }
end
