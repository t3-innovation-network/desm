class AddNotNullConstraintToMaxWeightInPredicateSets < ActiveRecord::Migration[7.2]
  def change
    change_column_null :predicate_sets, :max_weight, false
  end
end