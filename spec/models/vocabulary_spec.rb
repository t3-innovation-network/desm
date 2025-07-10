# frozen_string_literal: true

# == Schema Information
#
# Table name: vocabularies
#
#  id                       :bigint           not null, primary key
#  content                  :jsonb            not null
#  context                  :jsonb            not null
#  name                     :string           not null
#  version                  :integer          default(1), not null
#  created_at               :datetime         not null
#  updated_at               :datetime         not null
#  configuration_profile_id :bigint           not null
#
# Indexes
#
#  index_vocabularies_on_configuration_profile_id  (configuration_profile_id)
#
# Foreign Keys
#
#  fk_rails_...  (configuration_profile_id => configuration_profiles.id) ON DELETE => cascade
#
require "rails_helper"

describe Vocabulary do
  # TODO: Add tests for Vocabulary model
end
