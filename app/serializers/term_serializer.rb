# frozen_string_literal: true

class TermSerializer < ApplicationSerializer
  attributes :compact_domains, :raw, :source_uri, :slug, :uri
  has_one :property
  has_many :vocabularies, serializer: PreviewSerializer
  has_one :organization, if: -> { params[:spine] || params[:with_organization] }, serializer: PreviewSerializer
  has_many :specifications

  attribute :max_mapping_weight, if: -> { params[:spine] } do
    object.max_mapping_weight
  end

  attribute :current_mapping_weight, if: -> { params[:spine] && params[:spine_id] } do
    object.alignments.mapped_for_spine(params[:spine_id]).joins(:predicate).sum("predicates.weight")
  end

  attribute :title do
    object.source_uri.to_s.split(":").last.presence || object.name
  end

  attribute :comments do
    node = Parsers::JsonLd::Node.new(object.raw.slice("rdfs:comment"))
    sanitizer = Rails::Html::FullSanitizer.new
    node.read_as_language_map("comment").map { sanitizer.sanitize(_1) }
  end
end
