# frozen_string_literal: true

class CreateTermsVocabulariesJoinTable < ActiveRecord::Migration[6.0]
  def change
    create_join_table :terms, :vocabularies do |t|
      t.index :term_id
      t.index :vocabulary_id
    end
  end
end
