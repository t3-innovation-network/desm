# frozen_string_literal: true

class RenameMappingTermVocbularyColumnToAlignment < ActiveRecord::Migration[6.0]
  def change
    rename_column :alignment_vocabularies, :mapping_term_id, :alignment_id
  end
end
