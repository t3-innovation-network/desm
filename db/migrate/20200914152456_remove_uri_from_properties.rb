# frozen_string_literal: true

class RemoveURIFromProperties < ActiveRecord::Migration[6.0]
  def change
    remove_column :properties, :uri, :string
  end
end
