class RemoveUniqueConstraintOnSourceUriFromPredicateSets < ActiveRecord::Migration[6.0]
  def change
    remove_index :predicate_sets, column: :source_uri
  end
end
