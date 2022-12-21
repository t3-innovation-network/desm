class RemoveURIFromSpecificationsTable < ActiveRecord::Migration[6.0]
  def change
    remove_column :specifications, :uri, :string
  end
end
