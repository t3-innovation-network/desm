class AddUniqueIndexToPredicates < ActiveRecord::Migration[6.1]
  def change
    add_index :predicates, %i[predicate_set_id pref_label], unique: true
  end
end
