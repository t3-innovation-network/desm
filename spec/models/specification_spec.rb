# frozen_string_literal: true

require "rails_helper"

describe Specification, type: :model do
  it "has a valid factory" do
    expect(FactoryBot.build(:specification)).to be_valid
  end

  describe "attributes" do
    let(:spec) { FactoryBot.build(:specification) }

    it "has a uri" do
      expect(spec.uri).not_to be_nil
    end

    it "must not be created without a uri" do
      s = Specification.new(name: "test")
      expect { s.save! }.to raise_error(ActiveRecord::RecordInvalid)
    end
  end
end
