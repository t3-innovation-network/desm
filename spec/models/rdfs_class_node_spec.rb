# frozen_string_literal: true

require "rails_helper"

RSpec.describe RdfsClassNode, type: :model do
  it "has a valid factory" do
    expect(FactoryBot.build(:rdfs_class_node)).to be_valid
  end

  it { should validate_presence_of(:uri) }
  it { should validate_presence_of(:definition) }
  it { should validate_uniqueness_of(:uri) }
end
