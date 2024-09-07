# frozen_string_literal: true

# == Schema Information
#
# Table name: alignments
#
#  id             :bigint           not null, primary key
#  comment        :text
#  synthetic      :boolean          default(FALSE), not null
#  transformation :jsonb
#  uri            :string
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  mapping_id     :bigint           not null
#  predicate_id   :bigint
#  spine_term_id  :integer
#  vocabulary_id  :bigint
#
# Indexes
#
#  index_alignments_on_mapping_id     (mapping_id)
#  index_alignments_on_predicate_id   (predicate_id)
#  index_alignments_on_vocabulary_id  (vocabulary_id)
#
# Foreign Keys
#
#  fk_rails_...  (mapping_id => mappings.id) ON DELETE => cascade
#  fk_rails_...  (predicate_id => predicates.id)
#  fk_rails_...  (spine_term_id => terms.id) ON DELETE => cascade
#  fk_rails_...  (vocabulary_id => vocabularies.id)
#
require "faker"

FactoryBot.define do
  factory :alignment do
    uri { Faker::Lorem.sentence }
    comment { Faker::Lorem.sentence }
    mapping
    predicate
  end
end
