# frozen_string_literal: true

class CreateDomains < ActiveRecord::Migration[6.0]
  def change
    create_table :domains do |t|
      t.string :pref_label, null: false
      t.string :uri, null: false
      t.text :definition
      t.references :domain_set, null: false, foreign_key: {on_delete: :cascade}

      t.timestamps
    end

    add_index :domains, :uri, unique: true
  end
end
