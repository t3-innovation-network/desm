class RenameUriToSourceUriInDomainsTable < ActiveRecord::Migration[6.0]
  def change
    rename_column :domains, :uri, :source_uri
  end
end
