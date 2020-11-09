# frozen_string_literal: true

class RemoveDatatypeFromProperty < ActiveRecord::Migration[6.0]
  def change
    remove_column :properties, :datatype
  end
end
