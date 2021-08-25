class AddNewAttributesToUsers < ActiveRecord::Migration[6.0]
  def change
    change_table :users do |t|
      t.string :phone
      t.string :github_handle
    end
  end
end
