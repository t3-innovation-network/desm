# frozen_string_literal: true

# == Schema Information
#
# Table name: mappings
#
#  id                            :bigint           not null, primary key
#  description                   :text
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

describe Mapping do
  it { is_expected.to validate_presence_of(:name) }

  describe ".remove_alignments_mapped_terms" do
    xit "'in-progress' mapping has empty alignments after it is marked back as 'uploaded'" do
      # add test
    end
  end
end
