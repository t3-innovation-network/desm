# frozen_string_literal: true

class RemoveMappedTermIdFromMappingTerm < ActiveRecord::Migration[6.0]
  def change
    remove_column :mapping_terms, :mapped_term_id
  end
end
