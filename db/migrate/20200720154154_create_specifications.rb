# frozen_string_literal: true

class CreateSpecifications < ActiveRecord::Migration[6.0]
  def change
    create_table :specifications do |t|
      t.string :name, null: false
      t.string :description

      t.timestamps
    end
  end
end
