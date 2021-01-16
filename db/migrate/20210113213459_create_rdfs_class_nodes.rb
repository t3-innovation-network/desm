# frozen_string_literal: true

class CreateRdfsClassNodes < ActiveRecord::Migration[6.0]
  def change
    create_table :rdfs_class_nodes do |t|
      t.string :uri
      t.jsonb :definition

      t.timestamps
      t.index :uri, unique: true
    end
  end
end
