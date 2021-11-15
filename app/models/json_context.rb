# frozen_string_literal: true

# Caches JSON contexts referenced in schemas
class JsonContext < ApplicationRecord
  def self.fetch(uri)
    context = find_or_initialize_by(uri: uri)
    return context.payload if context.persisted?

    payload = HTTParty.get(uri).parsed_response.fetch("@context", {})
    context.update!(payload: payload)
    payload
  end
end
