# frozen_string_literal: true

class AddFullNameToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :fullname, :string
  end

  def down
    remove_column :users, :fullname
  end
end
