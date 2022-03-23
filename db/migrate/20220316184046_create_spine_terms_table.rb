class CreateSpineTermsTable < ActiveRecord::Migration[6.0]
  def change
    create_join_table :spines, :terms do |t|
      t.index %i[spine_id term_id], unique: :true
    end
  end
end
