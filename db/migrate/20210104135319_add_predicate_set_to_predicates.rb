# frozen_string_literal: true

class AddPredicateSetToPredicates < ActiveRecord::Migration[6.0]
  def change
    add_column :predicates, :predicate_set_id, :integer, column_options: {null: true}
  end
end
