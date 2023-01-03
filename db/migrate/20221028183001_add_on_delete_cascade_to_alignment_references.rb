class AddOnDeleteCascadeToAlignmentReferences < ActiveRecord::Migration[6.0]
  def change
    remove_foreign_key :alignment_vocabularies, :alignments
    add_foreign_key :alignment_vocabularies, :alignments, on_delete: :cascade

    remove_foreign_key :alignment_vocabulary_concepts, :alignment_vocabularies
    add_foreign_key :alignment_vocabulary_concepts, :alignment_vocabularies, on_delete: :cascade

    remove_foreign_key :alignment_vocabulary_concept_mapped_concepts, :alignment_vocabulary_concepts
    add_foreign_key :alignment_vocabulary_concept_mapped_concepts, :alignment_vocabulary_concepts, on_delete: :cascade
  end
end
