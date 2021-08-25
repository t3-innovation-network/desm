# frozen_string_literal: true

require "rails_helper"

describe ConfigurationProfile, type: :model do
  subject { FactoryBot.create(:configuration_profile) }
  it "has a valid factory" do
    expect(FactoryBot.build(:configuration_profile)).to be_valid
  end

  it { should have_many(:standards_ogranizations) }

  context "when it is incomplete" do
    it "has incomplete state at creation" do
      expect(subject.state_class).to be_instance_of(CpState::Incomplete)
    end

    it "can be removed" do
      subject.remove

      expect { subject.reload }.to raise_error ActiveRecord::RecordNotFound
    end

    it "can be completed if validates" do
      subject.complete

      expect(subject.state_class).to be_instance_of(CpState::Complete)
    end

    it "can not be activated" do
      expect { subject.activate }.to raise_error CpState::InvalidStateTransition
    end

    it "can be exported" do
      exported_cp = subject.export

      expect(exported_cp).to be_equal(subject.structure)
    end

    it "can not be deactivated" do
      expect { subject.activate }.to raise_error CpState::InvalidStateTransition
    end
  end

  context "when it is completed" do
    before(:each) do
      subject.complete
    end

    it "can be removed" do
      subject.remove

      expect { subject.reload }.to raise_error ActiveRecord::RecordNotFound
    end

    it "can not be completed again" do
      expect { subject.complete }.to raise_error CpState::InvalidStateTransition
    end

    it "can be activated" do
      subject.activate

      expect(subject.state_class).to be_instance_of(CpState::Active)
    end

    it "can be exported" do
      exported_cp = subject.export

      expect(exported_cp).to be_equal(subject.structure)
    end

    it "can not be deactivated" do
      expect { subject.deactivate }.to raise_error CpState::InvalidStateTransition
    end
  end

  context "when it is active" do
    before(:each) do
      subject.complete
      subject.activate
    end

    it "can be removed" do
      subject.remove

      expect { subject.reload }.to raise_error ActiveRecord::RecordNotFound
    end

    it "can not be completed" do
      expect { subject.complete }.to raise_error CpState::InvalidStateTransition
    end

    it "can not be activated again" do
      expect { subject.activate }.to raise_error CpState::InvalidStateTransition
    end

    it "can be exported" do
      exported_cp = subject.export

      expect(exported_cp).to be_equal(subject.structure)
    end

    it "can be deactivated" do
      subject.deactivate

      expect(subject.state_class).to be_instance_of(CpState::Complete)
    end
  end
end
