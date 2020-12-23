# frozen_string_literal: true

class CreateMergedFiles < ActiveRecord::Migration[6.0]
  def change
    create_table :merged_files do |t|
      t.jsonb :content, null: false, default: "{}"

      t.timestamps
    end
  end
end
