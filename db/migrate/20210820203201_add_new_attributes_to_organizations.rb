class AddNewAttributesToOrganizations < ActiveRecord::Migration[6.0]
  def change
    change_table :organizations do |t|
      t.references :configuration_profile, null: false, foreign_key: true
      t.references :administrator, foreign_key: { to_table: :users }

      t.text :description, null: true
      t.string :homepage_url
      t.string :standards_page
    end
  end
end
