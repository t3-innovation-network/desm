class RenameURIToSourceURIInPredicateSetsTable < ActiveRecord::Migration[6.0]
  def change
    rename_column :predicate_sets, :uri, :source_uri
  end
end
