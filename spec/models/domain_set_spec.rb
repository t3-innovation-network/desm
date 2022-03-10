# frozen_string_literal: true

require "rails_helper"

RSpec.describe DomainSet, type: :model do
  let(:ds) { create :domain_set }

  it "has a valid factory" do
    expect(FactoryBot.build(:domain_set)).to be_valid
  end

  it { should validate_presence_of(:source_uri) }
  it { should validate_presence_of(:title) }

  it "gets the slug generated when saving and when changing name" do
    expect(ds.slug.nil?).to be_falsey

    ds.update(name: "Something Else")
    expect(ds.slug).to be_eql "Something+Else"
  end
end
