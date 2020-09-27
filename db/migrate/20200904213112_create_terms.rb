# frozen_string_literal: true

class CreateTerms < ActiveRecord::Migration[6.0]
  def change
    create_table :terms do |t|
      t.string :name
      t.string :uri, null: false
      t.references :specification, null: false, foreign_key: true

      t.timestamps
    end
  end
end
