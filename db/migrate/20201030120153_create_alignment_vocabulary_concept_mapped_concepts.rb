# frozen_string_literal: true

class CreateAlignmentVocabularyConceptMappedConcepts < ActiveRecord::Migration[6.0]
  def change
    # The name stands for vocabulary mapping concept -> mapped concepts:
    # - The vocabulary mapping represents the mapping between 2 vocabularies.
    # - Each of these mappings have 1 to many concepts.
    # - Each of these concepts, have one spine property vocabulary concept,
    # - and many mapping property vocabulary concepts.
    #
    # The name for this table violates the masimum longitud for an index in PGSQL (63 chars).
    # So the name was shortened.
    create_table :alignv_mapped_concepts do |t|
      t.references :alignment_vocabulary_concept, null: false, foreign_key: true
      t.references :skos_concept, null: false, foreign_key: true
    end
  end
end
