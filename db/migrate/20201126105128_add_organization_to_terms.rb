# frozen_string_literal: true

class AddOrganizationToTerms < ActiveRecord::Migration[6.0]
  def change
    add_reference :terms, :organization, foreign_key: true
  end
end
