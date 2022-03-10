class AddSlugToPredicateSetsTable < ActiveRecord::Migration[6.0]
  def change
    change_table :predicate_sets do |t|
      t.string :slug
    end
  end
end
