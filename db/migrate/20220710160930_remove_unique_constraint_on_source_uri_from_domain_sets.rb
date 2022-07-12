class RemoveUniqueConstraintOnSourceUriFromDomainSets < ActiveRecord::Migration[6.0]
  def change
    remove_index :domain_sets, column: :source_uri
    add_index :domain_sets, :source_uri
  end
end
