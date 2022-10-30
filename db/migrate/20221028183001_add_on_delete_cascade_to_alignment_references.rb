class AddOnDeleteCascadeToAlignmentReferences < ActiveRecord::Migration[6.0]
  def change
    remove_foreign_key :alignment_vocabularies, :alignments
    add_foreign_key :alignment_vocabularies, :alignments, on_delete: :cascade

    remove_foreign_key :alignment_vocabulary_concepts, :alignment_vocabularies
    add_foreign_key :alignment_vocabulary_concepts, :alignment_vocabularies, on_delete: :cascade
  end
end
