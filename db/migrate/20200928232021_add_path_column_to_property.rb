# frozen_string_literal: true

class AddPathColumnToProperty < ActiveRecord::Migration[6.0]
  def change
    add_column :properties, :path, :string
  end
end
