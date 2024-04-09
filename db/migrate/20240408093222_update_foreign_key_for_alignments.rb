class UpdateForeignKeyForAlignments < ActiveRecord::Migration[6.1]
  def change
    # change a foreign key constraint to the alignments table with ON DELETE CASCADE
    remove_foreign_key :alignments, :terms, column: :spine_term_id
    add_foreign_key :alignments, :terms, column: :spine_term_id, on_delete: :cascade
  end
end
