# frozen_string_literal: true

class AddWeightToPredicates < ActiveRecord::Migration[6.0]
  def change
    change_table :predicates do |t|
      t.float :weight, null: false, default: 0
    end
  end
end
