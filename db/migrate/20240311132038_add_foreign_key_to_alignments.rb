class AddForeignKeyToAlignments < ActiveRecord::Migration[6.1]
def change
    # Add a foreign key constraint to the alignments table with ON DELETE RESTRICT
    add_foreign_key :alignments, :terms, column: :spine_term_id, on_delete: :restrict
  end
end
