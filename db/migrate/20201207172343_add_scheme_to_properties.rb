# frozen_string_literal: true

class AddSchemeToProperties < ActiveRecord::Migration[6.0]
  def change
    change_table :properties do |t|
      t.string :scheme
    end
  end
end
