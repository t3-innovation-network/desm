class CreateConfigurationProfilesOrganizations < ActiveRecord::Migration[6.0]
  def change
    create_table :configuration_profiles_organizations do |t|
      t.references :configuration_profile,
                   foreign_key: { on_delete: :cascade },
                   index: false,
                   null: false

      t.references :organization,
                   foreign_key: { on_delete: :cascade },
                   index: false,
                   null: false

      t.index %i[configuration_profile_id organization_id],
              name: 'index_configuration_profiles_organizations',
              unique: true
    end

    remove_reference :organizations, :configuration_profile
  end
end
