class AddStrongestMatchIdToPredicateSetTable < ActiveRecord::Migration[6.0]
  def change
    add_reference :predicate_sets, :strongest_match, foreign_key: { to_table: :predicates }, null: true
  end
end
