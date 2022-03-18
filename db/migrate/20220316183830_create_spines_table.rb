class CreateSpinesTable < ActiveRecord::Migration[6.0]
  def change
    create_table :spines do |t|
      t.string :name
      t.string :slug
      t.references :domain, foreign_key: :true
      t.references :organization, foreign_key: :true
    end
  end
end
