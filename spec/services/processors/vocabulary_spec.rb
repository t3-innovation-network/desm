# frozen_string_literal: true

require "rails_helper"

RSpec.describe Processors::Vocabularies do
  describe ".create" do
    let(:file_content) { File.read(file) }
    let(:organization) { FactoryBot.build(:organization) }
    let(:file) do
      Rack::Test::UploadedFile.new(
        Rails.root.join("spec", "fixtures", "DisabilityLevelCodeList.json")
      )
    end

    it "creates a vocabulary with its concepts" do
      processor = described_class.new(file_content)
      result = processor.create(Faker::App.name, organization)

      expect(result.concepts.count).to eq(5)
    end
  end
end
