# frozen_string_literal: true

# == Schema Information
#
# Table name: configuration_profiles
#
#  id                        :bigint           not null, primary key
#  description               :text
#  json_abstract_classes     :jsonb
#  json_mapping_predicates   :jsonb
#  name                      :string
#  predicate_strongest_match :string
#  slug                      :string
#  state                     :integer          default("incomplete"), not null
#  structure                 :jsonb
#  created_at                :datetime         not null
#  updated_at                :datetime         not null
#  administrator_id          :bigint
#  domain_set_id             :bigint
#  predicate_set_id          :bigint
#
# Indexes
#
#  index_configuration_profiles_on_administrator_id  (administrator_id)
#  index_configuration_profiles_on_domain_set_id     (domain_set_id)
#  index_configuration_profiles_on_predicate_set_id  (predicate_set_id)
#
# Foreign Keys
#
#  fk_rails_...  (administrator_id => users.id) ON DELETE => nullify
#  fk_rails_...  (domain_set_id => domain_sets.id)
#  fk_rails_...  (predicate_set_id => predicate_sets.id)
#
require "rails_helper"

describe ConfigurationProfile do
  before(:all) do
    @complete_structure = json_fixture("complete.configuration.profile.json")
    @valid_structure_with_invalid_email = json_fixture("valid.configuration.profile.with.invalid.email.json")
  end

  context "predicates strongest match" do
    before(:all) do
      @cp = create(:configuration_profile)
    end

    after(:all) do
      DatabaseCleaner.clean_with(:truncation)
    end

    it "fail to save an invalid predicate strongest match" do
      expect do
        @cp.update!(predicate_strongest_match: "should-fail-test.com/123456")
      end.to raise_error ActiveRecord::RecordNotSaved
    end

    it "accepts a valid predicate strongest match" do
      @cp.update!(predicate_strongest_match: "http://desmsolutions.org/concepts/identical")
      @cp.save!

      expect(@cp.predicate_strongest_match).to eql("http://desmsolutions.org/concepts/identical")
    end
  end

  context "when it is incomplete" do
    before(:all) do
      @cp = create(:configuration_profile)
    end

    before do
      @cp.structure = {}
    end

    after(:all) do
      DatabaseCleaner.clean_with(:truncation)
    end

    it "has incomplete state at creation and has not generated structure" do
      expect(@cp.state_handler).to be_instance_of(CpState::Incomplete)
      expect(@cp.standards_organizations).to be_empty
    end

    it "can not be activated" do
      expect { @cp.activate! }.to raise_error CpState::InvalidStateTransition
    end

    it "can be exported" do
      exported_cp = @cp.export!

      expect(exported_cp).to equal(@cp.structure)
    end

    it "can not be deactivated" do
      expect { @cp.activate! }.to raise_error CpState::InvalidStateTransition
    end

    it "can be completed if validates" do
      @cp.update!(structure: @complete_structure)

      expect(@cp.state_handler).to be_instance_of(CpState::Complete)
    end

    it "can be removed" do
      @cp.remove!

      expect { @cp.reload }.to raise_error ActiveRecord::RecordNotFound
    end
  end

  context "when it is completed" do
    before(:all) do
      Role.create!(name: "dso admin")
      Role.create!(name: "mapper")
      Role.create!(name: "profile admin")

      @cp = create(:configuration_profile)
      @cp.update!(structure: @complete_structure)
    end

    after(:all) do
      DatabaseCleaner.clean_with(:truncation)
    end

    it "has not generated structure" do
      expect(@cp.standards_organizations).to be_empty
    end

    it "can not be completed again" do
      expect(@cp.state_handler).to be_instance_of(CpState::Complete)
      expect { @cp.complete! }.to raise_error CpState::InvalidStateTransition
    end

    it "can be exported" do
      exported_cp = @cp.export!

      expect(exported_cp).to equal(@cp.structure)
    end

    it "can not be deactivated" do
      expect { @cp.deactivate! }.to raise_error CpState::InvalidStateTransition
    end

    it "can be activated" do
      @cp.activate!

      expect(@cp.state_handler).to be_instance_of(CpState::Active)
    end

    it "can be removed" do
      @cp.remove!

      expect { @cp.reload }.to raise_error ActiveRecord::RecordNotFound
    end
  end

  context "when it is active" do
    before(:all) do
      Role.create!(name: "dso admin")
      Role.create!(name: "mapper")
      Role.create!(name: "profile admin")

      @cp = create(:configuration_profile)
      @cp.update!(structure: @complete_structure)
      @cp.activate!
    end

    after(:all) do
      DatabaseCleaner.clean_with(:truncation)
    end

    it "has a generated structure" do
      sdos = @cp.standards_organizations

      expect(sdos.length).to be(1)
      expect(sdos.first.name).to eq(@complete_structure["standardsOrganizations"][0]["name"])
    end

    it "can not be completed" do
      expect { @cp.complete! }.to raise_error CpState::InvalidStateTransition
    end

    it "can not be activated again" do
      expect { @cp.activate! }.to raise_error CpState::InvalidStateTransition
    end

    it "can be exported" do
      exported_cp = @cp.export!

      expect(exported_cp).to equal(@cp.structure)
    end

    it "can be deactivated" do
      @cp.deactivate!

      expect(@cp.state_handler).to be_instance_of(CpState::Deactivated)
    end

    it "can be removed" do
      @cp.remove!

      expect { @cp.reload }.to raise_error ActiveRecord::RecordNotFound
    end
  end

  context "when it is deactivated" do
    before(:all) do
      Role.create!(name: "dso admin")
      Role.create!(name: "mapper")
      Role.create!(name: "profile admin")

      @cp = create(:configuration_profile)
      @cp.update!(structure: @complete_structure)
      @cp.activate!
      @cp.deactivate!
    end

    after(:all) do
      DatabaseCleaner.clean_with(:truncation)
    end

    it "has a not generated structure" do
      expect(@cp.standards_organizations.length).to eq(1)
    end

    it "can not be completed" do
      expect(@cp.state_handler).to be_instance_of(CpState::Deactivated)
      expect { @cp.complete! }.to raise_error CpState::InvalidStateTransition
    end

    it "can be exported" do
      exported_cp = @cp.export!

      expect(exported_cp).to equal(@cp.structure)
    end

    it "can not be deactivated again" do
      expect { @cp.deactivate! }.to raise_error CpState::InvalidStateTransition
    end

    it "can be activated" do
      @cp.activate!

      expect(@cp.state_handler).to be_instance_of(CpState::Active)
    end

    it "can be removed" do
      @cp.remove!

      expect { @cp.reload }.to raise_error ActiveRecord::RecordNotFound
    end
  end

  context "when its structure has to be validated" do
    before(:all) do
      @cp = create(:configuration_profile)
    end

    after(:all) do
      DatabaseCleaner.clean_with(:truncation)
    end

    it "rejects an invalid json structure for a configuration profile" do
      invalid_object = {
        standardsOrganizations: 123
      }
      @cp.update!(structure: invalid_object)

      expect(@cp).not_to be_structure_valid
    end

    it "accepts as valid but not as complete a json structure for a configuration profile" do
      valid_object = {
        name: "Test CP",
        description: "Example description for configuration profile",
        standardsOrganizations: [
          {
            name: "Example SDO"
          }
        ]
      }
      @cp.update!(structure: valid_object)

      expect(@cp).to be_structure_valid
      expect(@cp).not_to be_structure_complete
    end

    it "Returns the description of the errors when there are any" do
      object_with_additional_properties = {
        name: "Test CP",
        description: "Example description for a configuration profile"
      }

      @cp.update!(structure: object_with_additional_properties)
      validation_result = described_class.validate_structure(@cp.structure, "complete")

      expect(@cp).to be_structure_valid
      expect(validation_result).to include(a_string_matching("did not contain a required property"))
    end

    it "accepts as complete a complete and valid json structure for a configuration profile" do
      expect(@cp).not_to be_structure_complete
      expect(@cp.state_handler).to be_instance_of(CpState::Incomplete)

      @cp.update!(structure: @complete_structure)

      expect(@cp).to be_structure_complete
      expect(@cp.state_handler).to be_instance_of(CpState::Complete)
    end

    it "rejects a configuration profile structure with an invalid email for an agent" do
      @cp.update!(structure: @valid_structure_with_invalid_email)
      validation_result = described_class.validate_structure(@cp.structure)

      expect(@cp).not_to be_structure_complete
      expect(@cp).not_to be_structure_valid
      expect(validation_result).to include(a_string_matching("did not match the regex"))
      expect(@cp.state_handler).to be_instance_of(CpState::Incomplete)
      expect { @cp.complete! }.to raise_error CpState::NotYetReadyForTransition
    end
  end

  context "when it has to be removed" do
    before(:all) do
      Role.create!(name: "dso admin")
      Role.create!(name: "mapper")
      Role.create!(name: "profile admin")

      @cp = create(:configuration_profile)
      @cp.update!(structure: @complete_structure)
      @cp.activate!

      specification = @cp.specifications.first
      user = @cp.configuration_profile_users.first
      @mapping = Processors::Mappings.new(specification, user).create
    end

    after(:all) do
      DatabaseCleaner.clean_with(:truncation)
    end

    it "can't be removed if there is at least one in progress mapping" do
      @mapping.update!(status: :in_progress)

      expect { @cp.remove! }.to raise_error("In progress mappings, unable to remove")
    end

    it "can be removed if there is none in progress mappings" do
      @mapping.update!(status: :uploaded)
      @cp.remove!

      expect { @cp.reload }.to raise_error ActiveRecord::RecordNotFound
    end
  end

  describe "#destroy" do
    let(:configuration_profile1) { create(:configuration_profile) }
    let(:configuration_profile2) { create(:configuration_profile) }
    let(:user1) { create(:user) }
    let(:user2) { create(:user) }

    let!(:configuration_profile_user1) do
      create(:configuration_profile_user, configuration_profile: configuration_profile1, user: user1)
    end
    let!(:configuration_profile_user2) do
      create(:configuration_profile_user, configuration_profile: configuration_profile2, user: user2)
    end
    let!(:specification) { create(:specification, configuration_profile_user: configuration_profile_user1) }
    let!(:mapping) do
      create(:mapping, configuration_profile_user: configuration_profile_user1, specification:)
    end

    before do
      mapping.spine.terms = create_list(:term, 10)
      10.times { |i| create(:alignment, mapping:, spine_term: mapping.spine.terms[i]) }

      organization = create(:organization)
      configuration_profile1.standards_organizations << organization
      configuration_profile2.standards_organizations << organization
    end

    it "doesn't leave orphan organizations" do
      expect do
        configuration_profile1.destroy
      end.to(change(Alignment, :count).by(-10)
      .and(change(Organization, :count).by(0))
      .and(change(ConfigurationProfileUser, :count).by(-1))
      .and(change(Mapping, :count).by(-1))
      .and(change(Specification, :count).by(-1))
      .and(change(Spine, :count).by(-1))
      .and(change(User, :count).by(0)))

      expect { configuration_profile1.reload }.to raise_error(ActiveRecord::RecordNotFound)
      expect { mapping.reload }.to raise_error(ActiveRecord::RecordNotFound)
      expect { specification.reload }.to raise_error(ActiveRecord::RecordNotFound)

      expect { configuration_profile2.destroy }.to(change(Organization, :count).by(-1))
    end
  end

  context "when callbacks are triggered" do
    context "when predicates are updated" do
      let(:configuration_profile) { create(:configuration_profile, :with_mapping_predicates, predicates_count: 0) }

      it "triggers the update_predicates callback" do
        expect(UpdateMappingPredicates).to receive(:call).and_return(double(success?: true))
        expect(UpdateAbstractClasses).not_to receive(:call)
        configuration_profile.update!(json_mapping_predicates: [{ "prefLabel" => "test" }])
      end
    end

    context "when abstract classes are updated" do
      let(:configuration_profile) { create(:configuration_profile, :with_abstract_classes, abstract_classes_count: 0) }

      it "triggers the update_abstract_classes callback" do
        expect(UpdateAbstractClasses).to receive(:call).and_return(double(success?: true))
        expect(UpdateMappingPredicates).not_to receive(:call)
        configuration_profile.update!(json_abstract_classes: [{ "prefLabel" => "test" }])
      end
    end

    context "when predicate strongest match is updated" do
      let(:configuration_profile) { create(:configuration_profile, :with_mapping_predicates, predicates_count: 1) }
      let(:source_uri) { "http://desmsolutions.org/concepts/identical" }

      it "triggers the update_predicate_strongest_match callback" do
        predicate = create(:predicate, predicate_set: configuration_profile.mapping_predicates, source_uri:)
        configuration_profile.update!(predicate_strongest_match: source_uri)
        expect(configuration_profile.predicate_strongest_match).to eq(source_uri)
        expect(configuration_profile.mapping_predicates.strongest_match_id).to eq(predicate.id)
      end
    end
  end
end
