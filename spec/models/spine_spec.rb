# frozen_string_literal: true

# == Schema Information
#
# Table name: spines
#
#  id                            :bigint           not null, primary key
#  name                          :string
#  slug                          :string
#  configuration_profile_user_id :bigint           not null
#  domain_id                     :bigint
#
# Indexes
#
#  index_spines_on_configuration_profile_user_id  (configuration_profile_user_id)
#  index_spines_on_domain_id                      (domain_id)
#
# Foreign Keys
#
#  fk_rails_...  (configuration_profile_user_id => configuration_profile_users.id) ON DELETE => cascade
#  fk_rails_...  (domain_id => domains.id)
#
require "rails_helper"

RSpec.describe Spine, type: :model do
  let(:configuration_profile_user) { create(:configuration_profile_user) }
  let(:domain) { create(:domain) }
  let(:term1) { create(:term) }
  let(:term2) { create(:term) }

  describe "#to_json_ld" do
    let(:spine) { create(:spine, domain:, terms: [term1, term2]) }

    it "returns the spine attributes in JSON-LD format" do
      json_ld = spine.to_json_ld

      expect(json_ld[:name]).to eq(spine.name)
      expect(json_ld[:uri]).to eq(spine.uri)
      expect(json_ld[:domain]).to eq(domain.uri)
      expect(json_ld[:terms]).to eq([term1.uri, term2.uri].sort)
    end
  end

  describe "associations" do
    it { should belong_to(:configuration_profile_user) }
    it { should belong_to(:domain) }
    it { should have_one(:configuration_profile).through(:configuration_profile_user) }
    it { should have_one(:organization).through(:configuration_profile_user) }
    it { should have_and_belong_to_many(:terms) }
    it { should have_many(:mappings) }
  end

  describe "callbacks" do
    describe "before_destroy" do
      let(:spine) { create(:spine) }

      context "when mappings exist" do
        before { create(:mapping, spine:) }

        it "raises an error and prevents the spine from being destroyed" do
          expect do
            spine.destroy
          end.to raise_error(RuntimeError)
        end
      end

      context "when no mappings exist" do
        it "does not raise an error and allows the spine to be destroyed" do
          expect { spine.destroy }.not_to raise_error
        end
      end
    end
  end
end
