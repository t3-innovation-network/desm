# frozen_string_literal: true

require "rails_helper"

RSpec.describe Organization, type: :model do
  let(:organization) { create :organization }

  it "has a valid factory" do
    expect(FactoryBot.build(:organization)).to be_valid
  end

  it { should validate_presence_of(:name) }

  it "gets the slug generated when saving and when changing name" do
    expect(organization.slug.nil?).to be_falsey

    organization.update(name: "Something Else")
    expect(organization.slug).to be_eql "Something+Else"
  end
end
