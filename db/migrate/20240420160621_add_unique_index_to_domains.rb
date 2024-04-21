class AddUniqueIndexToDomains < ActiveRecord::Migration[6.1]
  def change
    add_index :domains, %i[domain_set_id pref_label], unique: true
  end
end
