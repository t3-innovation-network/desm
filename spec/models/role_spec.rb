# frozen_string_literal: true

# == Schema Information
#
# Table name: roles
#
#  id         :bigint           not null, primary key
#  name       :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
require "rails_helper"

describe Role do
  it "validates and has associations", :aggregate_failures do
    is_expected.to validate_presence_of(:name)
    expect(subject).to have_many(:assignments)
    expect(subject).to have_many(:users).through(:assignments)
  end
end
