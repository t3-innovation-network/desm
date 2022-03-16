# frozen_string_literal: true

require "rails_helper"

describe ConfigurationProfile, type: :model do
  before(:all) do
    @complete_structure = JSON.parse(
      File.read(
        Rails.root.join("spec", "fixtures", "complete.configuration.profile.json")
      )
    )
    @valid_structure_with_invalid_email = JSON.parse(
      File.read(
        Rails.root.join("spec", "fixtures", "valid.configuration.profile.with.invalid.email.json")
      )
    )
  end

  it "has a valid factory" do
    expect(FactoryBot.build(:configuration_profile)).to be_valid
  end

  it { should have_many(:standards_organizations) }

  context "predicates strongest match" do
    before(:all) do
      @cp = FactoryBot.create(:configuration_profile)
    end

    after(:all) do
      DatabaseCleaner.clean_with(:truncation)
    end

    it "fail to save an invalid predicate strongest match" do
      expect {
        @cp.update!(predicate_strongest_match: "should-fail-test.com/123456")
      }.to raise_error ActiveRecord::RecordNotSaved
    end

    it "accepts a valid predicate strongest match" do
      @cp.update!(predicate_strongest_match: "http://desmsolutions.org/concepts/identical")
      @cp.save!

      expect(@cp.predicate_strongest_match).to eql("http://desmsolutions.org/concepts/identical")
    end
  end

  context "when it is incomplete" do
    before(:all) do
      @cp = FactoryBot.create(:configuration_profile)
    end

    before(:each) do
      @cp.structure = {}
    end

    after(:all) do
      DatabaseCleaner.clean_with(:truncation)
    end

    it "has incomplete state at creation" do
      expect(@cp.state_handler).to be_instance_of(CpState::Incomplete)
    end

    it "has not generated structure" do
      expect(@cp.standards_organizations).to be_empty
    end

    it "can not be activated" do
      expect { @cp.activate! }.to raise_error CpState::InvalidStateTransition
    end

    it "can be exported" do
      exported_cp = @cp.export!

      expect(exported_cp).to be_equal(@cp.structure)
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

      @cp = FactoryBot.create(:configuration_profile)
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

      expect(exported_cp).to be_equal(@cp.structure)
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

      @cp = FactoryBot.create(:configuration_profile)
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

      expect(exported_cp).to be_equal(@cp.structure)
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

      @cp = FactoryBot.create(:configuration_profile)
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

      expect(exported_cp).to be_equal(@cp.structure)
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
      @cp = FactoryBot.create(:configuration_profile)
    end

    after(:all) do
      DatabaseCleaner.clean_with(:truncation)
    end

    it "rejects an invalid json structure for a configuration profile" do
      invalid_object = {
        "standardsOrganizations": 123
      }
      @cp.update!(structure: invalid_object)

      expect(@cp.structure_valid?).to be_falsey
    end

    it "accepts as valid but not as complete a json structure for a configuration profile" do
      valid_object = {
        "name": "Test CP",
        "description": "Example description for configuration profile",
        "standardsOrganizations": [
          {
            "name": "Example SDO"
          }
        ]
      }
      @cp.update!(structure: valid_object)

      expect(@cp.structure_valid?).to be_truthy
      expect(@cp.structure_complete?).to be_falsey
    end

    it "Returns the description of the errors when there are any" do
      object_with_additional_properties = {
        "name": "Test CP",
        "description": "Example description for a configuration profile",
        "additionalProperty": "additional property"
      }

      @cp.update!(structure: object_with_additional_properties)
      validation_result = ConfigurationProfile.validate_structure(@cp.structure)

      expect(@cp.structure_valid?).to be_falsey
      expect(validation_result).to include(a_string_matching("contains additional properties"))
    end

    it "accepts as complete a complete and valid json structure for a configuration profile" do
      expect(@cp.structure_complete?).to be_falsey
      expect(@cp.state_handler).to be_instance_of(CpState::Incomplete)

      @cp.update!(structure: @complete_structure)

      expect(@cp.structure_complete?).to be_truthy
      expect(@cp.state_handler).to be_instance_of(CpState::Complete)
    end

    it "rejects a configuration profile structure with an invalid email for an agent" do
      @cp.update!(structure: @valid_structure_with_invalid_email)
      validation_result = ConfigurationProfile.validate_structure(@cp.structure)

      expect(@cp.structure_complete?).to be_falsey
      expect(@cp.structure_valid?).to be_falsey
      expect(validation_result).to include(a_string_matching("did not match the regex"))
      expect(@cp.state_handler).to be_instance_of(CpState::Incomplete)
      expect { @cp.complete! }.to raise_error CpState::NotYetReadyForTransition
    end
  end

  context "when it has to be removed, it checks mappings" do
    before(:all) do
      Role.create!(name: "dso admin")
      Role.create!(name: "mapper")
      Role.create!(name: "profile admin")

      @cp = FactoryBot.create(:configuration_profile)
      @cp.update!(structure: @complete_structure)
      @cp.activate!

      specification = @cp.standards_organizations.first.schemes.first
      user = @cp.standards_organizations.first.agents.first
      @mapping = Processors::Mappings.new(specification, user).create
    end

    after(:all) do
      DatabaseCleaner.clean_with(:truncation)
    end

    it "can't be removed if there is at least one in progress mapping" do
      @mapping.update!(status: :in_progress)

      expect { @cp.remove! }.to raise_error ActiveRecord::RecordNotDestroyed
    end

    it "can be removed if there is none in progress mappings" do
      @mapping.update!(status: :uploaded)
      @cp.remove!

      expect { @cp.reload }.to raise_error ActiveRecord::RecordNotFound
    end
  end
end
