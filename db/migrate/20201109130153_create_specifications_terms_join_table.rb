# frozen_string_literal: true

class CreateSpecificationsTermsJoinTable < ActiveRecord::Migration[6.0]
  def change
    create_join_table :specifications, :terms do |t|
      t.index %i[specification_id term_id], unique: true
    end
  end
end
