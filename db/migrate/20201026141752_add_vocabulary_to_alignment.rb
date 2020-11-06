# frozen_string_literal: true

class AddVocabularyToAlignment < ActiveRecord::Migration[6.0]
  def change
    change_table :mapping_terms do |t|
      t.references :vocabulary, foreign_key: true
    end
  end
end
