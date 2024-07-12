# frozen_string_literal: true

class MappingSerializer < ApplicationSerializer
  attributes :description, :domain, :mapped_at, :mapped_terms, :origin, :slug, :specification_id, :spine_id, :status,
             :title
  attributes :uploaded?, :mapped?, :in_progress?, :ready_to_upload?
  belongs_to :specification do
    { id: object.specification.id, name: object.specification.name,
      version: object.specification.version,
      domain: { id: object.specification.domain_id, name: object.specification.domain&.pref_label,
                spine: object.specification.domain&.spine? },
      user: { id: object.specification.user.id, fullname: object.specification.user.fullname },
      compact_domains: object.specification.compact_domains || [] }
  end
  has_many :selected_terms, serializer: PreviewSerializer
  belongs_to :organization, serializer: PreviewSerializer

  attribute :new_spine_created?, if: -> { params[:spine] }
  attribute :spine_origin, if: -> { params[:spine] }
end
