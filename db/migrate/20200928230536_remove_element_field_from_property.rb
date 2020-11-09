# frozen_string_literal: true

class RemoveElementFieldFromProperty < ActiveRecord::Migration[6.0]
  def change
    remove_column :properties, :element
  end
end
