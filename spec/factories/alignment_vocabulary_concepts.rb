# frozen_string_literal: true

FactoryBot.define do
  factory :alignment_vocabulary_concept do
    alignment_vocabulary
    spine_concept { create(:skos_concept) }
  end
end
