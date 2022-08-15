# frozen_string_literal: true

# Caches JSON contexts referenced in schemas
class JsonContext < ApplicationRecord
  def self.fetch(uri)
    context = find_or_initialize_by(uri: uri)
    return context.payload if context.persisted?

    parsed_response = HTTParty.get(uri).parsed_response
    payload = JSON(parsed_response) if parsed_response.is_a?(String)
    context.update!(payload: payload.fetch("@context", {}))
    payload
  end
end
