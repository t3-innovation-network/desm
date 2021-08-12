# frozen_string_literal: true

class RenameMappingTermMappedTermsToAlignmentMappedTerms < ActiveRecord::Migration[6.0]
  def change
    rename_table :mapping_term_mapped_terms, :alignment_mapped_terms
  end
end
