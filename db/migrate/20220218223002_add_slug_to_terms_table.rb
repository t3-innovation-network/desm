class AddSlugToTermsTable < ActiveRecord::Migration[6.0]
  def change
    change_table :terms do |t|
      t.string :slug
      t.json :raw, null: false
    end
  end
end
