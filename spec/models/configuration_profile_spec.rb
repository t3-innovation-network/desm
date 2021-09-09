# frozen_string_literal: true

require "rails_helper"

describe ConfigurationProfile, type: :model do
  subject { FactoryBot.create(:configuration_profile) }

  let(:complete_structure) {
    JSON.parse(File.read(Rails.root.join("spec", "fixtures", "complete.configuration.profile.json")))
  }
  let(:valid_structure_with_invalid_email) {
    JSON.parse(File.read(Rails.root.join("spec", "fixtures", "valid.configuration.profile.with.invalid.email.json")))
  }

  before(:each) do
    Role.create!(name: "dso admin")
    Role.create!(name: "mapper")
    Role.create!(name: "profile admin")
  end

  it "has a valid factory" do
    expect(FactoryBot.build(:configuration_profile)).to be_valid
  end

  it { should have_many(:standards_organizations) }

  context "when it is incomplete" do
    it "has incomplete state at creation" do
      expect(subject.state_handler).to be_instance_of(CpState::Incomplete)
    end

    it "has not generated structure" do
      expect(subject.standards_organizations).to be_empty
    end

    it "can be removed" do
      subject.remove!

      expect { subject.reload }.to raise_error ActiveRecord::RecordNotFound
    end

    it "can be completed if validates" do
      subject.structure = complete_structure
      subject.save!
      expect(subject.state_handler).to be_instance_of(CpState::Complete)
    end

    it "can not be activated" do
      expect { subject.activate! }.to raise_error CpState::InvalidStateTransition
    end

    it "can be exported" do
      exported_cp = subject.export!

      expect(exported_cp).to be_equal(subject.structure)
    end

    it "can not be deactivated" do
      expect { subject.activate! }.to raise_error CpState::InvalidStateTransition
    end
  end

  context "when it is completed" do
    before(:each) do
      subject.structure = complete_structure
      subject.save!
    end

    it "has not generated structure" do
      expect(subject.standards_organizations).to be_empty
    end

    it "can be removed" do
      subject.remove!

      expect { subject.reload }.to raise_error ActiveRecord::RecordNotFound
    end

    it "can not be completed again" do
      expect(subject.state_handler).to be_instance_of(CpState::Complete)
      expect { subject.complete! }.to raise_error CpState::InvalidStateTransition
    end

    it "can be activated" do
      subject.activate!

      expect(subject.state_handler).to be_instance_of(CpState::Active)
    end

    it "can be exported" do
      exported_cp = subject.export!

      expect(exported_cp).to be_equal(subject.structure)
    end

    it "can not be deactivated" do
      expect { subject.deactivate! }.to raise_error CpState::InvalidStateTransition
    end
  end

  context "when it is active" do
    before(:each) do
      subject.structure = complete_structure
      subject.save!
      subject.activate!
    end

    it "has a generated structure" do
      sdos = subject.standards_organizations

      expect(sdos.length).to be(1)
      expect(sdos.first.name).to eq(complete_structure["standardsOrganizations"][0]["name"])
    end

    # @todo remove cascade (agents, dsos, abstract classes, mapping predicates, schemas and concept schemes)
    xit "can be removed" do
      subject.remove!

      expect { subject.reload }.to raise_error ActiveRecord::RecordNotFound
    end

    it "can not be completed" do
      expect { subject.complete! }.to raise_error CpState::InvalidStateTransition
    end

    it "can not be activated again" do
      expect { subject.activate! }.to raise_error CpState::InvalidStateTransition
    end

    it "can be exported" do
      exported_cp = subject.export!

      expect(exported_cp).to be_equal(subject.structure)
    end

    it "can be deactivated" do
      subject.deactivate!

      expect(subject.state_handler).to be_instance_of(CpState::Deactivated)
    end
  end

  context "when it is deactivated" do
    before(:each) do
      subject.update!(structure: complete_structure)
      subject.activate!
      subject.deactivate!
    end

    it "has a not generated structure" do
      expect(subject.standards_organizations.length).to eq(1)
    end

    # @todo remove cascade (agents, dsos, abstract classes, mapping predicates, schemas and concept schemes)
    xit "can be removed" do
      subject.remove!

      expect { subject.reload }.to raise_error ActiveRecord::RecordNotFound
    end

    it "can not be completed" do
      expect(subject.state_handler).to be_instance_of(CpState::Deactivated)
      expect { subject.complete! }.to raise_error CpState::InvalidStateTransition
    end

    it "can be activated" do
      subject.activate!

      expect(subject.state_handler).to be_instance_of(CpState::Active)
    end

    it "can be exported" do
      exported_cp = subject.export!

      expect(exported_cp).to be_equal(subject.structure)
    end

    it "can not be deactivated again" do
      expect { subject.deactivate! }.to raise_error CpState::InvalidStateTransition
    end
  end

  context "when its structure has to be validated" do
    it "rejects an invalid json structure for a configuration profile" do
      invalid_object = {
        "standardsOrganizations": 123
      }
      subject.structure = invalid_object

      expect(subject.structure_valid?).to be_falsey
    end

    it "rejects a valid but not complete json structure for a configuration profile" do
      valid_object = {
        "name": "Test CP",
        "description": "Example description for configuration profile",
        "standardsOrganiations": [
          {
            "name": "Example SDO"
          }
        ]
      }
      subject.structure = valid_object

      expect(subject.structure_valid?).to be_truthy
      expect(subject.structure_complete?).to be_falsey
    end

    it "accepts as complete a complete and valid json structure for a configuration profile" do
      expect(subject.structure_complete?).to be_falsey
      expect(subject.state_handler).to be_instance_of(CpState::Incomplete)

      subject.update!(structure: complete_structure)

      expect(subject.structure_complete?).to be_truthy
      expect(subject.state_handler).to be_instance_of(CpState::Complete)
    end

    it "rejects a configuration profile structure with an invalid email for an agent" do
      subject.structure = valid_structure_with_invalid_email

      expect(subject.structure_complete?).to be_falsey
      expect(subject.structure_valid?).to be_falsey
      expect(subject.state_handler).to be_instance_of(CpState::Incomplete)
      expect { subject.complete! }.to raise_error CpState::NotYetReadyForTransition
    end
  end
end
