# frozen_string_literal: true

class AlignmentSerializer < ApplicationSerializer
  attributes :comment, :mapping_id, :origin, :predicate_id, :spine_term_id, :synthetic, :uri, :vocabulary_id
  attributes :mapped_terms, :predicate
  attribute :name do
    object.uri
  end
  attribute :schema_name, if: -> { params[:with_schema_name] } do
    schema = object.mapping.specification
    "#{schema.name}#{schema.version.present? ? " (#{schema.version})" : ''}"
  end

  # pass the params to the serializer
  def mapped_terms
    ActiveModel::Serializer::CollectionSerializer.new(object.mapped_terms, each_serializer: TermSerializer,
                                                                           with_organization: true)
  end

  def predicate
    PredicateSerializer.new(object.predicate, base: true) if object.predicate
  end
end
