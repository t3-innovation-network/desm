# frozen_string_literal: true

class CreateVocabularies < ActiveRecord::Migration[6.0]
  def change
    create_table :vocabularies do |t|
      t.string :name
      t.references :organization, null: false, foreign_key: true
      t.jsonb :content, null: false, default: "{}"

      t.timestamps
    end
  end
end
