# frozen_string_literal: true

require "rails_helper"

describe Property, type: :model do
  it "has a valid factory" do
    expect(FactoryBot.build(:property)).to be_valid
  end

  it { should belong_to(:term) }
end
