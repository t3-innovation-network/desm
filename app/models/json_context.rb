# frozen_string_literal: true

# Caches JSON contexts referenced in schemas
class JsonContext < ApplicationRecord
  def self.fetch(uri)
    context = find_or_initialize_by(uri: uri)
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
