class AddSlugToSpecificationsTable < ActiveRecord::Migration[6.0]
  def change
    change_table :specifications do |t|
      t.string :slug
    end
  end
end
