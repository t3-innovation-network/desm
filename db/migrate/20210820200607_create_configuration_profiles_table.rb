class CreateConfigurationProfilesTable < ActiveRecord::Migration[6.0]
  def change
    create_table :configuration_profiles do |t|
      t.text :description
      t.string :name
      t.jsonb :structure
      t.integer :state, null: false, default: 0
      t.references :domain_set, null: true, foreign_key: true
      t.references :predicate_set, null: true, foreign_key: true
      t.references :administrator, null: true, foreign_key: { to_table: :users }
      t.timestamps
    end
  end
end
