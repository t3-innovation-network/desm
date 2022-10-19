class AddOnDeleteCascadeToMappingIdInAlignments < ActiveRecord::Migration[6.0]
  def change
    remove_foreign_key :alignments, :mappings
    add_foreign_key :alignments, :mappings, on_delete: :cascade
  end
end
