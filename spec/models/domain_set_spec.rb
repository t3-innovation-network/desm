# frozen_string_literal: true

# == Schema Information
#
# Table name: domain_sets
#
#  id          :bigint           not null, primary key
#  creator     :string
#  description :text
#  slug        :string
#  source_uri  :string           not null
#  title       :string           not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#
# Indexes
#
#  index_domain_sets_on_source_uri  (source_uri)
#
require "rails_helper"

RSpec.describe DomainSet do
  let(:ds) { create(:domain_set) }

  it "validates presence" do
    is_expected.to validate_presence_of(:source_uri)
    is_expected.to validate_presence_of(:title)
  end

  it "gets the slug generated when saving and when changing name" do
    expect(ds.slug).not_to be_nil

    ds.update(name: "Something Else")
    expect(ds.slug).to eql "Something+Else"
  end
end
