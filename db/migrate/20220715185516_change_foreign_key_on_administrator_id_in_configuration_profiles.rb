class ChangeForeignKeyOnAdministratorIdInConfigurationProfiles < ActiveRecord::Migration[6.0]
  def change
    remove_foreign_key :configuration_profiles, :users, column: :administrator_id
    add_foreign_key :configuration_profiles, :users, column: :administrator_id, on_delete: :nullify
  end
end
