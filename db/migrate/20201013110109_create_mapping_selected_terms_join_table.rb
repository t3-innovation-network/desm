# frozen_string_literal: true

class CreateMappingSelectedTermsJoinTable < ActiveRecord::Migration[6.0]
  def change
    create_table :mapping_selected_terms do |t|
      t.references :mapping, foreign_key: true
      t.references :term, foreign_key: true
      t.index %i[mapping_id term_id], unique: true
    end
  end
end
