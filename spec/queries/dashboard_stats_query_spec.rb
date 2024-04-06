# frozen_string_literal: true

require "rails_helper"

RSpec.describe DashboardStatsQuery do
  let(:scope) { User }

  subject { described_class.new(scope).call }

  describe "#call" do
    it "returns a hash with configuration_profiles and mappings" do
      expect(subject).to be_a(Hash)
      expect(subject).to have_key(:configuration_profiles)
      expect(subject).to have_key(:mappings)
    end
  end
end
