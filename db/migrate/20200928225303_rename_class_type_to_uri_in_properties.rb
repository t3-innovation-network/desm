# frozen_string_literal: true

class RenameClassTypeToURIInProperties < ActiveRecord::Migration[6.0]
  def change
    rename_column :properties, :classtype, :uri
  end
end
