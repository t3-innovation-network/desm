# frozen_string_literal: true

class RemoveUriFromProperties < ActiveRecord::Migration[6.0]
  def change
    remove_column :properties, :uri, :string
  end
end
