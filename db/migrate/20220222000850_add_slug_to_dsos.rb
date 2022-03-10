class AddSlugToDsos < ActiveRecord::Migration[6.0]
  def change
    change_table :organizations do |t|
      t.string :slug
    end
  end
end
