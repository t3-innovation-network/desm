# frozen_string_literal: true

require "rails_helper"

RSpec.describe Exporters::MappingExportProfile do
  before(:all) do
    Role.create!(name: "profile admin")
    Role.create!(name: "dso admin")
    Role.create!(name: "mapper")
    @cp = create(:configuration_profile)
    complete_structure = Rails.root.join("spec", "fixtures", "complete.configuration.profile.json")
    valid_json_abstract_classes = JSON.parse(File.read(Rails.root.join("concepts", "desmAbstractClasses.json")))
    valid_json_mapping_predicates =
      JSON.parse(
        File.read(Rails.root.join("concepts", "desmMappingPredicates.json"))
      )
    @cp.update!(
      structure: JSON.parse(File.read(complete_structure)),
      json_abstract_classes: valid_json_abstract_classes,
      json_mapping_predicates: valid_json_mapping_predicates
    )
    @cp.activate!
  end

  after(:all) do
    DatabaseCleaner.clean_with(:truncation)
  end

  describe ".export" do
    it "contains the necessary elements" do
      domain = Domain.first
      specification = Specification.first
      specification.update!(domain: domain)
      result = domain.mapping_export_profile

      expect(result.keys).to eq(%i(@configurationProfile @abstractClass @spine))
    end
  end
end
