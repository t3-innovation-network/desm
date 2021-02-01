# frozen_string_literal: true

class RenameMappinTermColumnInAlignmentMappedTerms < ActiveRecord::Migration[6.0]
  def change
    rename_column :alignment_mapped_terms, :mapping_term_id, :alignment_id
  end
end
