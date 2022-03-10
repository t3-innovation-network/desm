class AddSlugToAbstractClassSetTable < ActiveRecord::Migration[6.0]
  def change
    change_table :domain_sets do |t|
      t.string :slug
    end
  end
end
