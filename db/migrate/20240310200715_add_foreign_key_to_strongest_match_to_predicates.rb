class AddForeignKeyToStrongestMatchToPredicates < ActiveRecord::Migration[6.1]
  def change
    # Add a foreign key constraint to the predicates table for strongest_match
    remove_foreign_key :predicate_sets, :predicates, column: :strongest_match_id
    add_foreign_key :predicate_sets, :predicates, column: :strongest_match_id, on_delete: :restrict
  end
end