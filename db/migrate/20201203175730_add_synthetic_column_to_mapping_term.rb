# frozen_string_literal: true

class AddSyntheticColumnToMappingTerm < ActiveRecord::Migration[6.0]
  def change
    change_table :mapping_terms do |t|
      t.boolean :synthetic, null: false, default: false
    end
  end
end
