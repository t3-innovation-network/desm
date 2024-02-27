# frozen_string_literal: true

require "rails_helper"

RSpec.describe Processors::Vocabularies do
  describe ".create" do
    let(:file_content) { File.read(file) }
    let(:configuration_profile) { create(:configuration_profile) }
    let(:file) do
      Rack::Test::UploadedFile.new(file_fixture("DisabilityLevelCodeList.json"))
    end

    it "creates a vocabulary with its concepts" do
      processor = described_class.new(file_content)
      result = processor.create(Faker::App.name, configuration_profile)

      expect(result.concepts.count).to eq(5)
    end
  end
end
