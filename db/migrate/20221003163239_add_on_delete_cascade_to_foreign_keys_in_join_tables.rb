class AddOnDeleteCascadeToForeignKeysInJoinTables < ActiveRecord::Migration[6.0]
  def change
    remove_foreign_key :alignment_mapped_terms, :alignments
    remove_foreign_key :alignment_mapped_terms, :terms
    remove_foreign_key :mapping_selected_terms, :mappings
    remove_foreign_key :mapping_selected_terms, :terms

    add_foreign_key :alignment_mapped_terms, :alignments, on_delete: :cascade
    add_foreign_key :alignment_mapped_terms, :terms, on_delete: :cascade
    add_foreign_key :mapping_selected_terms, :mappings, on_delete: :cascade
    add_foreign_key :mapping_selected_terms, :terms, on_delete: :cascade
  end
end
