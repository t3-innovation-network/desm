# frozen_string_literal: true

class AddPredicateSetToPredicates < ActiveRecord::Migration[6.0]
  def change
    add_reference :predicates, :predicate_set, foreign_key: {on_delete: :cascade}, null: :false
  end
end
