# frozen_string_literal: true

class CreateSpecifications < ActiveRecord::Migration[6.0]
  def change
    create_table :specifications do |t|
      t.string :name, null: false
      t.string :uri, null: false
      t.string :version
      t.string :use_case
      t.references :user, null: false, foreign_key: true
      t.references :domain, null: false, foreign_key: true

      t.timestamps
    end

    add_index :specifications, :uri, unique: true
  end
end
