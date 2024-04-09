# frozen_string_literal: true

# == Schema Information
#
# Table name: json_contexts
#
#  id         :bigint           not null, primary key
#  payload    :jsonb            not null
#  uri        :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_json_contexts_on_uri  (uri) UNIQUE
#

# Caches JSON contexts referenced in schemas
class JsonContext < ApplicationRecord
  def self.fetch(uri)
    context = find_or_initialize_by(uri:)
    return context.payload if context.persisted?

    parsed_response = HTTParty.get(uri).parsed_response

    payload =
      if parsed_response.is_a?(String)
        JSON(parsed_response)
      else
        parsed_response
      end

    context.update!(payload: payload.fetch("@context", {}))
    context.payload
  end
end
