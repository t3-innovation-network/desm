# frozen_string_literal: true

class CreateSkosConcepts < ActiveRecord::Migration[6.0]
  def change
    create_table :skos_concepts do |t|
      t.jsonb :raw
      t.string :uri, null: false
    end

    add_index :skos_concepts, :uri, unique: true
  end
end
