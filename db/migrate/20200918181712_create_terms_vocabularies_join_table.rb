# frozen_string_literal: true

class CreateTermsVocabulariesJoinTable < ActiveRecord::Migration[6.0]
  def change
    create_join_table :terms, :vocabularies do |t|
      t.index %i[term_id vocabulary_id], unique: true
    end
  end
end
