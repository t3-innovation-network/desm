class AddMappedAtToMapping < ActiveRecord::Migration[6.1]
  def change
    add_column :mappings, :mapped_at, :datetime
  end
end
