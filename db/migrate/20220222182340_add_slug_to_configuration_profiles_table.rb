class AddSlugToConfigurationProfilesTable < ActiveRecord::Migration[6.0]
  def change
    change_table :configuration_profiles do |t|
      t.string :slug
    end
  end
end
