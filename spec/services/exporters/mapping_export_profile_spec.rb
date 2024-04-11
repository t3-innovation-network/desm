# frozen_string_literal: true

require "rails_helper"

RSpec.describe Exporters::MappingExportProfile do
  before(:all) do
    Role.create!(name: "profile admin")
    Role.create!(name: "dso admin")
    Role.create!(name: Desm::MAPPER_ROLE_NAME)
    @cp = create(:configuration_profile)
    complete_structure = file_fixture("complete.configuration.profile.json")
    valid_json_abstract_classes = json_fixture("desmAbstractClasses.json")
    valid_json_mapping_predicates = json_fixture("desmMappingPredicates.json")
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
      specification.update!(domain:)
      result = domain.mapping_export_profile

      expect(result.keys).to eq(%i(@configurationProfile @abstractClass @spine))
    end
  end
end
