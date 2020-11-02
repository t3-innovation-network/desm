# frozen_string_literal: true

class CreateAlignmentVocabularyConcept < ActiveRecord::Migration[6.0]
  def change
    create_table :alignment_vocabulary_concepts do |t|
      t.references :alignment_vocabulary, null: false, foreign_key: true
      t.references :predicate, null: true, foreign_key: true
      t.integer :spine_concept_id, null: false
    end
  end
end
