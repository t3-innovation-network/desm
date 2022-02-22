class RenameUriToSourceUriInPredicatesTable < ActiveRecord::Migration[6.0]
  def change
    rename_column :predicates, :uri, :source_uri
  end
end
