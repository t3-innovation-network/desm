# frozen_string_literal: true

require "rails_helper"

RSpec.describe Processors::Skos do
  describe ".create" do
    let(:file_content) { File.read(file) }
    let(:organization) { Organization.first }
    let(:file) do
      Rack::Test::UploadedFile.new(
        Rails.root.join("spec", "fixtures", "DisabilityLevelCodeList.json")
      )
    end

    it "creates a vocabulary with its concepts" do
      processor = described_class.new({
                                        organization: organization,
                                        attrs: {
                                          name: Faker::App.name,
                                          content: file_content
                                        }
                                      })
      result = processor.create

      expect(result.concepts.count).to eq(5)
    end
  end
end
