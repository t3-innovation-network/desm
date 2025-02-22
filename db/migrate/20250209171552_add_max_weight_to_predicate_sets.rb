class AddMaxWeightToPredicateSets < ActiveRecord::Migration[7.2]
  def change
    add_column :predicate_sets, :max_weight, :float, default: 0.0
  end
end
