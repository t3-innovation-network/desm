# frozen_string_literal: true

class AddSpineToDomains < ActiveRecord::Migration[6.0]
  def change
    add_column :domains, :spine_id, :integer, column_options: {null: true}
  end
end
