# frozen_string_literal: true

class AddTypeAndElementToProperties < ActiveRecord::Migration[6.0]
  def change
    add_column :properties, :classtype, :string
    add_column :properties, :element, :string
  end
end
