# frozen_string_literal: true

class AddSelectedDomainAndRangeToProperty < ActiveRecord::Migration[6.0]
  def change
    add_column :properties, :selected_domain, :string
    add_column :properties, :selected_range, :string
  end
end
