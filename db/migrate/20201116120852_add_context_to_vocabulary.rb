# frozen_string_literal: true

class AddContextToVocabulary < ActiveRecord::Migration[6.0]
  def change
    change_table :vocabularies do |t|
      t.jsonb :context, null: false, default: {}
    end
  end
end
