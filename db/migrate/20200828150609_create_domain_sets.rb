# frozen_string_literal: true

class CreateDomainSets < ActiveRecord::Migration[6.0]
  def change
    create_table :domain_sets do |t|
      t.string :title, null: false
      t.string :uri, null: false
      t.text :description
      t.string :creator

      t.timestamps
    end

    add_index :domain_sets, :uri, unique: true
  end
end
