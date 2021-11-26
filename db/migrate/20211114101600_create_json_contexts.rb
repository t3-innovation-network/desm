class CreateJsonContexts < ActiveRecord::Migration[6.0]
  def change
    create_table :json_contexts do |t|
      t.string :uri, index: { unique: true }, null: false
      t.jsonb :payload, default: {}, null: false

      t.timestamps
    end
  end
end
