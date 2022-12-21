class RemoveURIFromTermsTable < ActiveRecord::Migration[6.0]
  def change
    rename_column :terms, :uri, :source_uri
  end
end
