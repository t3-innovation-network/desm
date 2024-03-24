# frozen_string_literal: true

class PredicateSerializer < ApplicationSerializer
  attributes :pref_label, :definition, :source_uri, :color, :slug, :weight
  attribute :strongest_match do
    params[:base] ? nil : object.predicate_set.strongest_match_id == object.id
  end
end
