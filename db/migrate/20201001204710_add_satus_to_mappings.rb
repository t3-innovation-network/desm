# frozen_string_literal: true

class AddSatusToMappings < ActiveRecord::Migration[6.0]
  def change
    add_column :mappings, :status, :integer, default: 0
  end
end
