# frozen_string_literal: true

# == Schema Information
#
# Table name: predicate_sets
#
#  id                 :bigint           not null, primary key
#  creator            :string
#  description        :text
#  max_weight         :float            default(0.0), not null
#  slug               :string
#  source_uri         :string           not null
#  title              :string           not null
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  strongest_match_id :bigint
#
# Indexes
#
#  index_predicate_sets_on_strongest_match_id  (strongest_match_id)
#
# Foreign Keys
#
#  fk_rails_...  (strongest_match_id => predicates.id) ON DELETE => restrict
#

require "rails_helper"

RSpec.describe PredicateSet, type: :model do
  let(:predicate_set) { create(:predicate_set, source_uri: "http://example.com", title: "Example Title") }

  describe "validations" do
    it "is valid with valid attributes" do
      expect(predicate_set).to be_valid
    end

    it "is not valid without a source_uri" do
      predicate_set.source_uri = nil
      expect(predicate_set).to_not be_valid
    end

    it "is not valid without a title" do
      predicate_set.title = nil
      expect(predicate_set).to_not be_valid
    end
  end

  describe "#update_max_weight" do
    let(:predicate1) { create(:predicate, weight: 10) }
    let(:predicate2) { create(:predicate, weight: 20) }

    it "updates max_weight when a predicate is added" do
      predicate_set.predicates << predicate1
      expect(predicate_set.max_weight).to eq(10)

      predicate_set.predicates << predicate2
      expect(predicate_set.max_weight).to eq(20)
    end

    it "updates max_weight when a predicate is removed" do
      predicate_set.predicates << predicate1
      predicate_set.predicates << predicate2
      expect(predicate_set.max_weight).to eq(20)

      predicate_set.predicates.destroy(predicate2)
      expect(predicate_set.max_weight).to eq(10)
    end

    it "sets max_weight to nil if no predicates are present" do
      predicate_set.predicates << predicate1
      expect(predicate_set.max_weight).to eq(10)

      predicate_set.predicates.destroy(predicate1)
      expect(predicate_set.max_weight).to eq(0)
    end
  end
end
