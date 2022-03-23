class RemoveSpineIdFromDomainsTable < ActiveRecord::Migration[6.0]
  def change
    remove_column :domains, :spine_id, :integer
  end
end
