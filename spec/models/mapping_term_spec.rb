# frozen_string_literal: true

require "rails_helper"

describe MappingTerm, type: :model do
  it "has a valid factory" do
    expect(FactoryBot.build(:mapping)).to be_valid
  end

  it { should validate_presence_of(:uri) }
end
