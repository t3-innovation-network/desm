# frozen_string_literal: true

class TermSerializer < ApplicationSerializer
  attributes :comments, :compact_domains, :compact_ranges, :raw, :source_uri, :slug, :uri
  has_one :property
  has_many :vocabularies, unless: -> { params[:spine] }, serializer: PreviewSerializer
  has_one :organization, if: -> { params[:with_organization] }, serializer: PreviewSerializer

  attribute :specification_ids, if: -> { params[:specification_ids] } do
    if params[:specification_ids]
      params[:specification_ids][object.id] || []
    else
      object["specification_ids"] || object.specification_ids
    end
  end

  attribute :max_mapping_weight, if: -> { params[:spine] } do
    object.max_mapping_weight
  end

  attribute :title do
    object.source_uri.to_s.split(":").last.presence || object.name
  end
end
