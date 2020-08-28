# frozen_string_literal: true

class CreateDomains < ActiveRecord::Migration[6.0]
  def change
    create_table :domains do |t|
      t.string :pref_label
      t.text :definition
      t.string :uri
      t.references :domain_set, null: false, foreign_key: true

      t.timestamps
    end

    add_index :domains, :uri, unique: true
  end
end
