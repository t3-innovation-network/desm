# frozen_string_literal: true

class RenameSourcePathToSourceURIInProperties < ActiveRecord::Migration[6.0]
  def change
    rename_column :properties, :source_path, :source_uri
  end
end
