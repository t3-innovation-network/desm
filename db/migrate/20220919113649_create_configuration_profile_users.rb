class CreateConfigurationProfileUsers < ActiveRecord::Migration[6.0]
  def change
    create_table :configuration_profile_users do |t|
      t.references :configuration_profile,
                   foreign_key: { on_delete: :cascade },
                   index: false,
                   null: false

      t.references :organization,
                   foreign_key: { on_delete: :cascade },
                   index: false,
                   null: false

      t.references :user,
                   foreign_key: { on_delete: :cascade },
                   index: false,
                   null: false

      t.index %i[configuration_profile_id user_id],
              name: 'index_configuration_profile_user',
              unique: true
    end
  end
end
