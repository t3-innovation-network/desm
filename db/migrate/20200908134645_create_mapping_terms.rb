# frozen_string_literal: true

class CreateMappingTerms < ActiveRecord::Migration[6.0]
  def change
    create_table :mapping_terms do |t|
      t.string :uri
      t.text :comment
      t.references :mapping, null: false, foreign_key: true
      t.references :predicate, null: false, foreign_key: true
      t.integer :spine_term_id
      t.integer :mapped_term_id

      t.timestamps
    end
  end
end
