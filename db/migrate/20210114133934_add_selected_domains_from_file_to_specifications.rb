# frozen_string_literal: true

class AddSelectedDomainsFromFileToSpecifications < ActiveRecord::Migration[6.0]
  def change
    add_column :specifications, :selected_domains_from_file, :jsonb
  end
end
