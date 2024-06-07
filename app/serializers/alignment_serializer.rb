# frozen_string_literal: true

class AlignmentSerializer < ApplicationSerializer
  attributes :comment, :compact_domains, :mapping_id, :origin, :predicate_id, :spine_term_id, :synthetic, :uri,
             :vocabulary_id
  attributes :mapped_terms, :predicate
  attribute :mapping, if: -> { params[:with_schema_name] } do
    { id: object.mapping.id, title: object.mapping.title, description: object.mapping.description,
      updated_at: object.mapping.updated_at, created_at: object.mapping.created_at,
      mapped_at: object.mapping.mapped_at, specification: object.mapping.specification }
  end
  attribute :name do
    object.uri
  end
  attribute :schema_name, if: -> { params[:with_schema_name] } do
    schema = object.specification
    "#{schema.name}#{schema.version.present? ? " (#{schema.version})" : ''}"
  end
  attribute :selected_domains, if: -> { params[:with_schema_name] } do
    object.specification.selected_domains_from_file
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
