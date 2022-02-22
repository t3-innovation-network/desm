class AddSlugToMappingsTable < ActiveRecord::Migration[6.0]
  def change
    change_table :mappings do |t|
      t.string :slug
    end
  end
end
