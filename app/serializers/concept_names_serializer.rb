# frozen_string_literal: true

class ConceptNamesSerializer < ApplicationSerializer
  attributes :definition

  attribute :label do
    object.pref_label
  end

  attribute :uri do
    object.source_uri
  end
end
