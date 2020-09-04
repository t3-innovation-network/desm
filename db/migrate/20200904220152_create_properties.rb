# frozen_string_literal: true

class CreateProperties < ActiveRecord::Migration[6.0]
  def change
    create_table :properties do |t|
      t.string :uri, null: false
      t.string :datatype
      t.string :source_path
      t.string :subproperty_of
      t.string :value_space
      t.string :label
      t.text :comment
      t.string :domain
      t.string :range
      t.references :term, null: false, foreign_key: true

      t.timestamps
    end
  end
end
