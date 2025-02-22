# frozen_string_literal: true

class TermSerializer < ApplicationSerializer
  attributes :comments, :compact_domains, :compact_ranges, :raw, :source_uri, :slug, :uri
  has_one :property
  has_many :vocabularies, serializer: PreviewSerializer
  has_one :organization, if: -> { params[:spine] || params[:with_organization] }, serializer: PreviewSerializer

  attribute :specification_ids, if: -> { params[:spine] || params[:specification_ids] } do
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

  attribute :schema_name do
    if object["specification_ids"]
      first_spec = object.first_specification
      schema_name_for(first_spec["name"], first_spec["version"]) if first_spec
    elsif !params[:specification_ids]
      schema = object.specifications.select(:name, :version).first
      schema_name_for(schema.name, schema.version) if schema
    end
  end

  def schema_name_for(name, version)
    [name, version.present? ? "(#{version})" : nil].join(" ")
  end
end
