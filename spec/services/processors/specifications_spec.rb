# frozen_string_literal: true

require "rails_helper"

RSpec.describe Processors::Specifications do
  describe ".update" do
    let(:data) do
      {
        name: "Upd Specification",
        version: "1.0",
        domain_id: 1,
        selected_domains: ["schema:3DModel", "schema:APIReference"],
        spec: file_fixture("schema.jsonld").read,
        configuration_profile_user: instance.configuration_profile_user,
        mapping_id: mapping.id
      }
    end
    let(:instance) do
      create(:specification, selected_domains_from_file: ["schema:MedicalStudyStatus", "schema:3DModel"])
    end
    let!(:mapping) do
      create(:mapping, :ready_to_upload, spine: instance.domain.spine, specification: instance,
                                         configuration_profile_user: instance.configuration_profile_user)
    end
    subject { described_class.update(data, instance:) }

    it "updates the specification with the given data" do
      expect(subject.name).to eq(data[:name])
      expect(subject.version).to eq(data[:version])
      expect(subject.selected_domains_from_file).to match_array(
        ["schema:3DModel", "schema:APIReference", "schema:MedicalStudyStatus"]
      )
      expect(mapping.reload.status).to eq("uploaded")
    end
  end
end
