# frozen_string_literal: true

class AddUsersAssociationToOrganization < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :organization_id, :integer
    add_index "users", ["organization_id"], name: "users_organization_id"
  end

  def down
    remove_column :users, :organization_id
  end
end
