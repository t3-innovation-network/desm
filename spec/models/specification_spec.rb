# frozen_string_literal: true

# == Schema Information
#
# Table name: specifications
#
#  id                            :bigint           not null, primary key
#  name                          :string           not null
#  selected_domains_from_file    :jsonb
#  slug                          :string
#  use_case                      :string
#  version                       :string
#  created_at                    :datetime         not null
#  updated_at                    :datetime         not null
#  configuration_profile_user_id :bigint           not null
#  domain_id                     :bigint           not null
#
# Indexes
#
#  index_specifications_on_configuration_profile_user_id  (configuration_profile_user_id)
#  index_specifications_on_domain_id                      (domain_id)
#
# Foreign Keys
#
#  fk_rails_...  (configuration_profile_user_id => configuration_profile_users.id) ON DELETE => cascade
#  fk_rails_...  (domain_id => domains.id)
#
require "rails_helper"

describe Specification do
  describe "attributes" do
    let(:spec) { build(:specification) }

    it "has a uri" do
      expect(spec.uri).not_to be_nil
    end

    it "must not be created without a uri" do
      s = described_class.new(name: "test")
      expect { s.save! }.to raise_error(ActiveRecord::RecordInvalid)
    end
  end
end
