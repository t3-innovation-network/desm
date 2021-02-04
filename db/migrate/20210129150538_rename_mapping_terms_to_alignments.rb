# frozen_string_literal: true

class RenameMappingTermsToAlignments < ActiveRecord::Migration[6.0]
  def change
    rename_table :mapping_terms, :alignments
  end
end
