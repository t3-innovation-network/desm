# frozen_string_literal: true

require "rails_helper"

describe NormalizedParams do
  describe "#initialize" do
    it "converts keys to underscore" do
      q = described_class.new("fooBar" => "baz")
      expect(q.foo_bar).to eq("baz")
    end

    it "converts values to boolean (true)" do
      q = described_class.new("fooBar" => "true")
      expect(q.foo_bar).to eq(true)
    end

    it "converts values to boolean (false)" do
      q = described_class.new("fooBar" => "false")
      expect(q.foo_bar).to eq(false)
    end

    it "does not convert values when not boolean" do
      q = described_class.new("fooBar" => 1)
      expect(q.foo_bar).to eq(1)
    end
  end
end
