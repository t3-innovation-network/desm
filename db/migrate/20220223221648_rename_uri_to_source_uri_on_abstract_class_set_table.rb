class RenameUriToSourceUriOnAbstractClassSetTable < ActiveRecord::Migration[6.0]
  def change
    rename_column :domain_sets, :uri, :source_uri
  end
end
