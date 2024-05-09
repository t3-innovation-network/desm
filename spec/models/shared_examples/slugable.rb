# frozen_string_literal: true

require "rails_helper"

shared_examples "slugable validation" do |item_type|
  describe "#uniqueness_of_slug" do
    let!(:item1) { create(item_type, name: "Item1") }
    let(:item2) { build(item_type, name: "Item1") }

    it "returns error for the same slug" do
      expect(item2.valid?).to be_falsey
      expect(item2.errors[:name]).to include("has already been taken")
    end
  end
end
