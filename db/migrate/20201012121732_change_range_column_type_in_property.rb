# frozen_string_literal: true

class ChangeRangeColumnTypeInProperty < ActiveRecord::Migration[6.0]
  def change
    change_column :properties, :range, "jsonb USING CAST(range AS jsonb)"
  end
end
