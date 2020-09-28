# frozen_string_literal: true

require "rails_helper"

describe Mapping, type: :model do
  it "has a valid factory" do
    expect(FactoryBot.build(:mapping)).to be_valid
  end

  it { should validate_presence_of(:name) }
  it { should belong_to(:user) }
end
