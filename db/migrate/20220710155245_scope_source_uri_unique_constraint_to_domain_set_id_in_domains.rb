class ScopeSourceURIUniqueConstraintToDomainSetIdInDomains < ActiveRecord::Migration[6.0]
  def change
    remove_index :domains, column: :source_uri
    add_index :domains, %i[domain_set_id source_uri], unique: true
  end
end
