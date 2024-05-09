# frozen_string_literal: true

class OrganizationSerializer < ApplicationSerializer
  attributes :administrator_id, :description, :email, :homepage_url, :slug, :standards_page
  attribute :users, if: -> { params[:with_users] }

  def users
    data =
      if params[:configuration_profile]
        object.configuration_profile_users.for_configuration_profile(params[:configuration_profile]).map(&:user)
      else
        object.users
      end
    ActiveModel::Serializer::CollectionSerializer.new(data, serializer: AgentSerializer)
  end
end
