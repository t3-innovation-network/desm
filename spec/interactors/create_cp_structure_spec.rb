# frozen_string_literal: true

require "rails_helper"

RSpec.describe CreateCpStructure, type: :interactor do
  describe ".call" do
    let(:conf_p) { create(:configuration_profile) }

    it "rejects creation if structure does not match a complete structure" do
      result = described_class.call
      expect(result.error).to eq("configuration_profile must be present")

      result = described_class.call({ configuration_profile: conf_p })
      expect(result.error).to eq("incomplete structure")
    end

    describe ".call with valid configuration profile structure" do
      before(:all) do
        Role.create!(name: "profile admin")
        Role.create!(name: "dso admin")
        Role.create!(name: "mapper")
        @cp = create(:configuration_profile)
        complete_structure = file_fixture("complete.configuration.profile.json")
        valid_json_abstract_classes = json_fixture("desmAbstractClasses.json")
        valid_json_mapping_predicates = json_fixture("desmMappingPredicates.json")
        @cp.structure = JSON.parse(File.read(complete_structure))
        @cp.json_abstract_classes = valid_json_abstract_classes
        @cp.json_mapping_predicates = valid_json_mapping_predicates
        result = described_class.call({ configuration_profile: @cp })

        expect(result.error).to be_nil
      end

      after(:all) do
        DatabaseCleaner.clean_with(:truncation)
      end

      it "generates a structure with a valid abstract class set and its domains" do
        expect(@cp.abstract_classes.title).to eq("DESM Schema of Abstract Mapping Classes")
        expect(@cp.abstract_classes).to be_instance_of(DomainSet)
        expect(@cp.abstract_classes.domains.length).to eq(8)
        expect(@cp.abstract_classes.domains.first).to be_instance_of(Domain)
        expect(@cp.abstract_classes.domains.find_by_pref_label("Earnings")).to be_present
      end

      it "generates a structure with a valid predicates set and its predicates" do
        expect(@cp.mapping_predicates.title).to eq("DESM Schema Map Tuning Predicates")
        expect(@cp.mapping_predicates).to be_instance_of(PredicateSet)
        expect(@cp.mapping_predicates.predicates.length).to eq(9)
        expect(@cp.mapping_predicates.predicates.first).to be_instance_of(Predicate)
        expect(@cp.mapping_predicates.predicates.find_by_pref_label("No Match")).to be_present
      end

      it "generates a structure with dso's and its respective admin, agents, schemas and concept schemes" do
        first_org = @cp.standards_organizations.first
        first_schema = Specification.for_dso(first_org).first
        second_schema = Specification.for_dso(first_org).last
        learning_method_vocab = Vocabulary.find_by_name "Learning Method"
        org_type_vocab = Vocabulary.find_by_name "Organization Type"
        assessment_method_vocab = Vocabulary.find_by_name "Assessment Method"

        expect(@cp.standards_organizations.length).to eq(1)
        expect(first_org.name).to eq("Credential Registry")
        expect(first_org.users.find_by_email("mapper1@credreg.com")).to be_present
        expect(first_org.users.find_by_email("mapper1@credreg.com")).to be_present
        expect(Specification.for_dso(first_org).length).to eq(2)
        expect(first_schema.domain.pref_label).to eq("Organization")
        expect(second_schema.domain.pref_label).to eq("Credential")
        expect(learning_method_vocab).to be_present
        expect(learning_method_vocab.concepts.count).to eq(8)
        expect(org_type_vocab).to be_present
        expect(org_type_vocab.concepts.count).to eq(22)
        expect(assessment_method_vocab).to be_present
        expect(assessment_method_vocab.concepts.count).to eq(3)
      end
    end
  end
end
