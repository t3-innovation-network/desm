# frozen_string_literal: true

class CreateMappingTermMappedTermsJoinTable < ActiveRecord::Migration[6.0]
  def change
    create_table :mapping_term_mapped_terms do |t|
      t.references :mapping_term, foreign_key: true
      t.references :term, foreign_key: true
      t.index %i[mapping_term_id term_id], unique: true
    end
  end
end
