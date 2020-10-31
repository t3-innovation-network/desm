# frozen_string_literal: true

class CreateAlignmentVocabulary < ActiveRecord::Migration[6.0]
  def change
    create_table :alignment_vocabularies do |t|
      t.references :mapping_term, null: false, foreign_key: true
      t.string :title
      t.string :description
      t.string :creator
    end
  end
end
