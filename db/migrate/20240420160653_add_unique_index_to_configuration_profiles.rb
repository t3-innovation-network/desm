class AddUniqueIndexToConfigurationProfiles < ActiveRecord::Migration[6.1]
  def change
    add_index :configuration_profiles, :name, unique: true
  end
end
