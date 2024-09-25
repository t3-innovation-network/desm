class AddTranformationToAlignment < ActiveRecord::Migration[6.1]
  def change
    add_column :alignments, :transformation, :jsonb, default: {}
  end
end
