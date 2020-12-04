# frozen_string_literal: true

class AddEmailToOrganizations < ActiveRecord::Migration[6.0]
  def change
    # Add the column to the table
    change_table :organizations do |t|
      t.string :email
    end

    # Update the exissting records
    Organization.all.each {|o|
      o.update(email: "info@#{o.name.split(".").first.strip.downcase}.org")
    }

    # Add the constraint
    change_column_null(:organizations, :email, false)
  end
end
