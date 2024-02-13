# frozen_string_literal: true

# == Schema Information
#
# Table name: alignment_vocabularies
#
#  id           :bigint           not null, primary key
#  creator      :string
#  description  :string
#  title        :string
#  alignment_id :bigint           not null
#
# Indexes
#
#  index_alignment_vocabularies_on_alignment_id  (alignment_id)
#
# Foreign Keys
#
#  fk_rails_...  (alignment_id => alignments.id) ON DELETE => cascade
#
FactoryBot.define do
  factory :alignment_vocabulary do
    alignment
    title { Faker::Lorem.sentence }
  end
end
