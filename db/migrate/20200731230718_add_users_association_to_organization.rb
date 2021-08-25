# frozen_string_literal: true

class AddUsersAssociationToOrganization < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :organization_id, :integer, foreign_key: true
  end
end
