# frozen_string_literal: true

class CreateRoles < ActiveRecord::Migration[6.0]
  def change
    create_table :roles do |t|
      t.string :name, null: false

      t.timestamps
    end
  end
end
