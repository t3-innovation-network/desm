# frozen_string_literal: true

# == Schema Information
#
# Table name: predicates
#
#  id               :bigint           not null, primary key
#  color            :string
#  definition       :text
#  pref_label       :string
#  slug             :string
#  source_uri       :string
#  weight           :float            default(0.0), not null
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  predicate_set_id :bigint
#
# Indexes
#
#  index_predicates_on_predicate_set_id                 (predicate_set_id)
#  index_predicates_on_predicate_set_id_and_source_uri  (predicate_set_id,source_uri) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (predicate_set_id => predicate_sets.id) ON DELETE => cascade
#
require "rails_helper"

RSpec.describe Predicate do
  it "validates presence" do
    is_expected.to validate_presence_of(:source_uri)
    is_expected.to validate_presence_of(:pref_label)
  end
end
