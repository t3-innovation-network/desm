# frozen_string_literal: true

require "rails_helper"

describe Vocabulary, type: :model do
  it "has a valid factory" do
    expect(FactoryBot.build(:vocabulary)).to be_valid
  end
end
