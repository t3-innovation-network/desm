# frozen_string_literal: true

require "rails_helper"

describe ValidateCpStructure, type: :interactor do
  subject { described_class.call({ configuration_profile: }) }

  describe ".call" do
    context "with complete profile" do
      let(:configuration_profile) { create(:configuration_profile, :complete) }

      it "returns an array of error messages" do
        expect(subject.messages).to eq []
      end
    end

    context "with incomplete profile" do
      let(:configuration_profile) { create(:configuration_profile, :incomplete, structure:) }
      let(:structure) do
        { "name" => " ",
          "description" => nil,
          "abstract_classes" => { "name" => nil, "origin" => nil, "version" => nil, "description" => nil },
          "mapping_predicates" => {},
          "standards_organizations" =>
            [{ "name" => nil, "email" => "rwwww", "dso_agents" => [{ "fullname" => nil, "lead_mapper" => true }],
               "associated_schemas" => [] },
             { "name" => "DSO 2", "dso_agents" => [{ "fullname" => "Mapper N1", "lead_mapper" => false }],
               "associated_schemas" => [] }] }
      end

      it "returns an array of error messages" do
        expect(subject.messages.size).to eq 12
        expect(subject.grouped_messages.keys).to match_array(%w(abstract_classes standards_organizations
                                                                mapping_predicates general))
        org = subject.grouped_messages["standards_organizations"]
        expect(org.size).to eq 4
        expect(org["DSO (1st)"].size).to eq 3
        expect(org["DSO (DSO 2, 2nd) > Agent (Mapper N1, 1st)"].size).to eq 1
        expect(org.values.flatten.any? { |msg| msg[:message].blank? }).to be false
      end
    end
  end
end
