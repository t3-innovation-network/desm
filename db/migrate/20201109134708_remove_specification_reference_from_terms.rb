# frozen_string_literal: true

class RemoveSpecificationReferenceFromTerms < ActiveRecord::Migration[6.0]
  def change
    remove_column :terms, :specification_id
  end
end
