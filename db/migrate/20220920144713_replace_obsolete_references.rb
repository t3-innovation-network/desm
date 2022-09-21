class ReplaceObsoleteReferences < ActiveRecord::Migration[6.0]
  def change
    add_reference :mappings,
                  :configuration_profile_user,
                  foreign_key: { on_delete: :cascade },
                  null: false

    add_reference :specifications,
                  :configuration_profile_user,
                  foreign_key: { on_delete: :cascade },
                  null: false

    add_reference :spines,
                  :configuration_profile_user,
                  foreign_key: { on_delete: :cascade },
                  null: false

    add_reference :terms,
                  :configuration_profile_user,
                  foreign_key: { on_delete: :cascade },
                  null: false

    add_reference :vocabularies,
                  :configuration_profile,
                  foreign_key: { on_delete: :cascade },
                  null: false

    remove_reference :mappings, :user
    remove_reference :specifications, :user
    remove_reference :spines, :organization
    remove_reference :terms, :organization
    remove_reference :vocabularies, :organization
  end
end
