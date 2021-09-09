# frozen_string_literal: true

require "rails_helper"

RSpec.describe CreateCpStructure, type: :interactor do
  describe ".call" do
    let(:complete_structure) { Rails.root.join("spec", "fixtures", "complete.configuration.profile.json") }
    let(:incomplete_structure) { Rails.root.join("spec", "fixtures", "incomplete.configuration.profile.json") }
    let(:cp) { FactoryBot.create(:configuration_profile) }

    before(:each) do
      Role.create!(name: "profile admin")
      Role.create!(name: "dso admin")
      Role.create!(name: "mapper")
    end

    it "rejects creation if structure does not match a complete structure" do
      result = CreateCpStructure.call
      expect(result.error).to eq("configuration_profile must be present")

      result = CreateCpStructure.call({configuration_profile: cp})
      expect(result.error).to eq("incomplete structure")
    end

    describe ".call with valid configuration profile structure" do
      before(:each) do
        cp.structure = JSON.parse(File.read(complete_structure))
        result = CreateCpStructure.call({configuration_profile: cp})

        expect(result.error).to be_nil
      end

      it "generates a structure with a valid administrator" do
        expect(cp.administrator.fullname).to eq("Sergio Ramos")
        expect(cp.administrator.email).to eq("sergio@ramos.com")
        expect(cp.administrator.phone).to eq("(123) 123-1234")
      end

      it "generates a structure with a valid abstract class set and its domains" do
        expect(cp.abstract_classes.title).to eq("Audience")
        expect(cp.abstract_classes).to be_instance_of(DomainSet)
        expect(cp.abstract_classes.domains.length).to eq(18)
        expect(cp.abstract_classes.domains.first).to be_instance_of(Domain)
        expect(cp.abstract_classes.domains.find_by_pref_label("Former Student / Alumni")).to be_present
      end

      it "generates a structure with a valid predicates set and its predicates" do
        expect(cp.mapping_predicates.title).to eq("Organization Type")
        expect(cp.mapping_predicates).to be_instance_of(PredicateSet)
        expect(cp.mapping_predicates.predicates.length).to eq(22)
        expect(cp.mapping_predicates.predicates.first).to be_instance_of(Predicate)
        expect(cp.mapping_predicates.predicates.find_by_pref_label("Assessment Body")).to be_present
      end

      it "generates a structure with dso's and its respective admin, agents, schemas and concept schemes" do
        first_org = cp.standards_organizations.first
        first_schema = Specification.for_dso(first_org).first
        second_schema = Specification.for_dso(first_org).last
        learning_method_vocab = Vocabulary.find_by_name "Learning Method"
        org_type_vocab = Vocabulary.find_by_name "Organization Type"
        assessment_method_vocab = Vocabulary.find_by_name "Assessment Method"

        expect(cp.standards_organizations.length).to eq(1)
        expect(first_org.name).to eq("Credential Registry")
        expect(first_org.configuration_profile).to be(cp)
        expect(first_org.administrator.fullname).to eq("Lionel Messi")
        expect(first_org.users.find_by_email("mapper1@credreg.com")).to be_present
        expect(first_org.users.find_by_email("mapper1@credreg.com")).to be_present
        expect(Specification.for_dso(first_org).length).to eq(2)
        expect(first_schema.domain.pref_label).to eq("Former Student / Alumni")
        expect(second_schema.domain.pref_label).to eq("Citizen")
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
