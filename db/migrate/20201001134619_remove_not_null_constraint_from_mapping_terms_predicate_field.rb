# frozen_string_literal: true

class RemoveNotNullConstraintFromMappingTermsPredicateField < ActiveRecord::Migration[6.0]
  def change
    change_column :mapping_terms, :predicate_id, :bigint, null: true
  end
end
