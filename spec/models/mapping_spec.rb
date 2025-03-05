# frozen_string_literal: true

# == Schema Information
#
# Table name: mappings
#
#  id                            :bigint           not null, primary key
#  description                   :text
#  mapped_at                     :datetime
#  name                          :string
#  slug                          :string
#  status                        :integer          default("uploaded")
#  title                         :string
#  created_at                    :datetime         not null
#  updated_at                    :datetime         not null
#  configuration_profile_user_id :bigint           not null
#  specification_id              :bigint           not null
#  spine_id                      :integer
#
# Indexes
#
#  index_mappings_on_configuration_profile_user_id  (configuration_profile_user_id)
#  index_mappings_on_specification_id               (specification_id)
#
# Foreign Keys
#
#  fk_rails_...  (configuration_profile_user_id => configuration_profile_users.id) ON DELETE => cascade
#  fk_rails_...  (specification_id => specifications.id)
#
require "rails_helper"

describe Mapping, type: :model do
  describe "associations" do
    it { should belong_to(:configuration_profile_user) }
    it { should belong_to(:specification).dependent(:destroy) }
    it { should belong_to(:spine) }
    it { should have_one(:organization).through(:configuration_profile_user) }
    it { should have_one(:user).through(:configuration_profile_user) }
    it { should have_one(:configuration_profile).through(:configuration_profile_user) }
    it { should have_one(:mapping_predicates).through(:configuration_profile) }
    it { should have_many(:alignments) }
    it { should have_and_belong_to_many(:selected_terms).join_table(:mapping_selected_terms).class_name("Term") }
  end

  describe "validations" do
    it { should validate_presence_of(:name) }
  end

  describe "enums" do
    it { should define_enum_for(:status).with_values(uploaded: 0, in_progress: 1, mapped: 2, ready_to_upload: 3) }
  end

  describe "methods" do
    let(:mapping) { create(:mapping) }

    it "returns the domain of the specification" do
      expect(mapping.domain).to eq(mapping.specification.domain.pref_label)
      expect(mapping.origin).to eq(mapping.organization.name)
      expect(mapping.spine_origin).to eq(mapping.spine.organization.name)
    end

    it "exports the mapping into json-ld format" do
      exporter = instance_double("Exporters::Mapping")
      allow(Exporters::Mapping).to receive(:new).with(mapping).and_return(exporter)
      expect(exporter).to receive(:jsonld)
      mapping.export
    end

    it "returns the number of mapped terms" do
      create(:alignment, mapping:, mapped_terms: [create(:term)])
      create(:alignment, mapping:, mapped_terms: [create(:term)])
      expect(mapping.reload.mapped_terms).to eq(2)
    end

    it "removes all alignments from a mapping" do
      alignment1 = create(:alignment, mapping:)
      alignment2 = create(:alignment, mapping:)
      mapping.remove_alignments_mapped_terms
      expect(alignment1.reload.mapped_term_ids).to be_empty
      expect(alignment1.reload.predicate_id).to be_nil
      expect(alignment2.reload.mapped_term_ids).to be_empty
      expect(alignment2.reload.predicate_id).to be_nil
    end

    it "returns true if the spine is newly created" do
      expect(mapping.new_spine_created?).to be_truthy
      create(:mapping, spine: mapping.spine)
      expect(mapping.new_spine_created?).to be_falsey
    end

    it "updates the mapped_at attribute on status change" do
      mapping = create(:mapping, status: :uploaded)
      expect(mapping.mapped_at).to be_nil
      mapping.update(status: :in_progress)
      expect(mapping.mapped_at).to be_nil
      mapping.update(status: :mapped)
      expect(mapping.mapped_at).to be_within(1.second).of(Time.zone.now)
      time = 1.day.from_now
      Timecop.freeze(time) do
        mapping.touch(:mapped_at)
        expect(mapping.mapped_at).to be_within(1.second).of(time)
      end
    end

    context "with configuration profile predicates" do
      let(:configuration_profile) { create(:configuration_profile, :with_mapping_predicates) }
      let(:configuration_profile_user) do
        create(:configuration_profile_user, configuration_profile:)
      end
      let(:mapping) { create(:mapping, configuration_profile_user:) }
      let(:specification) { mapping.specification }
      let(:spine) { mapping.spine }
      let(:term1) { create(:term) }
      let(:term2) { create(:term) }
      let(:term3) { create(:term) }
      let(:term4) { create(:term) }

      it "updates the selected terms and generates alignments" do
        specification.terms = [term1, term2]

        expect do
          mapping.update_selected_terms([term1.id, term2.id])
        end.to change { spine.properties.count }.by(2)
                 .and change { spine.terms.count }.by(2)

        expect(mapping.selected_terms).to eq([term1, term2])
        expect(mapping.alignments.count).to eq(2)

        spine_term1 = spine.terms.first
        spine_term1_property = spine_term1.property.reload
        expect(spine_term1.name).to eq(term1.name)
        expect(spine_term1.raw).to eq(term1.raw)
        expect(spine_term1.slug).to eq(term1.slug)
        expect(spine_term1.source_uri).to eq(term1.source_uri)
        expect(spine_term1_property.comment).to eq(term1.property.comment)
        expect(spine_term1_property.domain).to eq([specification.domain.source_uri])
        expect(spine_term1_property.label).to eq(term1.property.label)
        expect(spine_term1_property.range).to eq(term1.property.range)

        spine_term2 = spine.terms.second
        spine_term2_property = spine_term2.property.reload
        expect(spine_term2.name).to eq(term2.name)
        expect(spine_term2.raw).to eq(term2.raw)
        expect(spine_term2.slug).to eq(term2.slug)
        expect(spine_term2.source_uri).to eq(term2.source_uri)
        expect(spine_term2_property.comment).to eq(term2.property.comment)
        expect(spine_term2_property.domain).to eq([specification.domain.source_uri])
        expect(spine_term2_property.label).to eq(term2.property.label)
        expect(spine_term2_property.range).to eq(term2.property.range)

        expect(mapping.alignments.first.mapped_terms).to eq([term1])
        expect(mapping.alignments.first.spine_term).to eq(spine_term1)

        expect(mapping.alignments.second.mapped_terms).to eq([term2])
        expect(mapping.alignments.second.spine_term).to eq(spine_term2)

        specification.terms += [term3, term4]

        expect do
          mapping.update_selected_terms([term1.id, term3.id, term4.id])
        end.to change { spine.properties.count }.by(0)
                 .and change { spine.terms.count }.by(0)

        expect(mapping.selected_terms).to eq([term1, term3, term4])
        expect(mapping.alignments.count).to eq(2)

        spine_term1 = spine.terms.first
        expect(spine_term1.name).to eq(term1.name)
        expect(spine_term1.raw).to eq(term1.raw)
        expect(spine_term1.slug).to eq(term1.slug)
        expect(spine_term1.source_uri).to eq(term1.source_uri)
        expect(spine_term1.property.comment).to eq(term1.property.comment)
        expect(spine_term1.property.domain).to eq([specification.domain.source_uri])
        expect(spine_term1.property.label).to eq(term1.property.label)
        expect(spine_term1.property.range).to eq(term1.property.range)

        spine_term2 = spine.terms.second
        expect(spine_term2.name).to eq(term2.name)
        expect(spine_term2.raw).to eq(term2.raw)
        expect(spine_term2.slug).to eq(term2.slug)
        expect(spine_term2.source_uri).to eq(term2.source_uri)
        expect(spine_term2.property.comment).to eq(term2.property.comment)
        expect(spine_term2.property.domain).to eq([specification.domain.source_uri])
        expect(spine_term2.property.label).to eq(term2.property.label)
        expect(spine_term2.property.range).to eq(term2.property.range)

        expect(mapping.alignments.first.mapped_terms).to eq([term1])
        expect(mapping.alignments.first.spine_term).to eq(spine_term1)

        expect(mapping.alignments.second.mapped_terms).to eq([term2])
        expect(mapping.alignments.second.spine_term).to eq(spine_term2)

        mapping.generate_alignments
      end

      it "generates empty alignments for subsequent uploads" do
        spine.terms = [term1, term2]

        expect do
          mapping.generate_alignments
        end.to change { mapping.alignments.count }.by(2)

        expect(mapping.alignments.first.mapped_terms).to eq([])
        expect(mapping.alignments.first.spine_term).to eq(spine.terms.first)

        expect(mapping.alignments.second.mapped_terms).to eq([])
        expect(mapping.alignments.second.spine_term).to eq(spine.terms.second)
      end
    end
  end
end
