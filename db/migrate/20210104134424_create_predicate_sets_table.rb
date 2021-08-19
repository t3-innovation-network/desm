# frozen_string_literal: true

class CreatePredicateSetsTable < ActiveRecord::Migration[6.0]
  def change
    create_table :predicate_sets do |t|
      t.string :title, null: false
      t.string :uri, null: false
      t.text :description
      t.string :creator

      t.timestamps
    end

    add_index :predicate_sets, :uri, unique: true
  end
end
