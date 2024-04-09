# frozen_string_literal: true

class TermSerializer < ApplicationSerializer
  attributes :raw, :source_uri, :slug, :uri
  has_one :property
  has_many :vocabularies, serializer: PreviewSerializer
  has_one :organization, if: -> { params[:spine] || params[:with_organization] }, serializer: PreviewSerializer
  attribute :max_mapping_weight do
    params[:spine] ? object.max_mapping_weight : nil
  end
  attribute :title do
    object.source_uri.to_s.split(":").last.presence || object.name
  end
end
