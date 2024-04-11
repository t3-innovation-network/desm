# frozen_string_literal: true

# subset of user attributes
class AgentSerializer < ApplicationSerializer
  attributes :email, :fullname, :github_handle, :organization_id, :phone

  attribute :name do
    object.fullname
  end
end
