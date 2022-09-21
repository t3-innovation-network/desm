# frozen_string_literal: true

require "rails_helper"

describe Mapping, type: :model do
  it "has a valid factory" do
    expect(FactoryBot.build(:mapping)).to be_valid
  end

  it { should validate_presence_of(:name) }

  describe ".remove_alignments_mapped_terms" do
    it "'in-progress' mapping has empty alignments after it is marked back as 'uploaded'" do
    end
  end
end
