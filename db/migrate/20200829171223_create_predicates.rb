# frozen_string_literal: true

class CreatePredicates < ActiveRecord::Migration[6.0]
  def change
    create_table :predicates do |t|
      t.string :pref_label
      t.text :definition
      t.string :uri

      t.timestamps
    end

    add_index :predicates, :uri, unique: true
  end
end
