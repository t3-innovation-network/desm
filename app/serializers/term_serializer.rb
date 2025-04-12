# frozen_string_literal: true

class TermSerializer < ApplicationSerializer
  attributes :comments, :compact_domains, :compact_ranges, :raw, :source_uri, :slug, :uri
  has_one :property
  has_many :vocabularies, serializer: PreviewSerializer
  has_one :organization, if: -> { params[:with_organization] }, serializer: PreviewSerializer

  attribute :specification_ids, if: -> { params[:specification_ids] } do
    if params[:specification_ids]
      params[:specification_ids][object.id] || []
    else
      object["specification_ids"] || object.specification_ids
    end
  end

  attribute :alignment_score, if: -> { params[:spine] } do
    if object.max_mapping_weight.positive?
      100 * object.current_mapping_weight / object.max_mapping_weight
    else
      0
    end
  end

  attribute :current_mapping_weight, if: -> { params[:spine] }

  attribute :max_mapping_weight, if: -> { params[:spine] }

  attribute :title do
    object.source_uri.to_s.split(":").last.presence || object.name
  end
end
