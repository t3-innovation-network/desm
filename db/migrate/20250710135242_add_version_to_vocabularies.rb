class AddVersionToVocabularies < ActiveRecord::Migration[7.2]
  def change
    add_column :vocabularies, :version, :integer, null: false, default: 1
  end
end
