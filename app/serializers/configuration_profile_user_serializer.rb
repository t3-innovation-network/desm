# frozen_string_literal: true

class ConfigurationProfileUserSerializer < ApplicationSerializer
  attributes :description, :slug, :state, :lead_mapper
  delegate :id, :name, :created_at, :updated_at, to: :configuration_profile
  delegate :description, :slug, :state, to: :configuration_profile

  def configuration_profile
    object.configuration_profile
  end

  attribute :with_shared_mappings, if: -> { params[:with_shared_mappings] } do
    configuration_profile.active? && configuration_profile.mappings.mapped.exists?
  end

  attribute :organization do
    PreviewSerializer.new(object.organization)
  end
end
