class AddSlugToDomainsTable < ActiveRecord::Migration[6.0]
  def change
    change_table :domains do |t|
      t.string :slug
    end
  end
end
