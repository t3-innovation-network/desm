class ScopeSourceURIUniqueConstraintToPredicateSetIdInPredicates < ActiveRecord::Migration[6.0]
  def change
    remove_index :predicates, column: :source_uri
    add_index :predicates, %i[predicate_set_id source_uri], unique: true
  end
end
