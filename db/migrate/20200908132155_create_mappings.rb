# frozen_string_literal: true

class CreateMappings < ActiveRecord::Migration[6.0]
  def change
    create_table :mappings do |t|
      t.string :name
      t.string :title
      t.text :description
      t.references :user, null: false, foreign_key: true
      t.references :specification, null: false, foreign_key: true
      t.integer :spine_id

      t.timestamps
    end
  end
end
