# frozen_string_literal: true

class ChangeDomainColumnTypeInProperty < ActiveRecord::Migration[6.0]
  def change
    change_column :properties, :domain, "jsonb USING CAST(domain AS jsonb)"
  end
end
