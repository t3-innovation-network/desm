# frozen_string_literal: true

class CreateConceptsVocabulariesJoinTable < ActiveRecord::Migration[6.0]
  def change
    create_join_table :skos_concepts, :vocabularies do |t|
      t.index %i[skos_concept_id vocabulary_id],
              unique: true,
              name: :index_skos_concepts_vocab_on_skos_concept_id_and_vocabulary_id
    end
  end
end
