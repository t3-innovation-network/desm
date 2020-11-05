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
    create_table :alignment_vocabulary_concept_mapped_concepts do |t|
      t.references :alignment_vocabulary_concept,
                   null: false,
                   foreign_key: true,
                   index: {name: :index_avc_mapped_concepts_acv_id}
      t.references :skos_concept,
                   null: false,
                   foreign_key: true,
                   index: {name: :index_avc_mapped_concepts_skos_concept_id}
      t.index %i[alignment_vocabulary_concept_id skos_concept_id],
              unique: true,
              name: :index_avcmc_alignment_vocabulary_concept_id_skos_concept_id
    end
  end
end
