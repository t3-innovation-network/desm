# frozen_string_literal: true

module HttpUrlValidator
  module_function

  def valid?(value)
    uri = URI.parse(value)
    uri.is_a?(URI::HTTP) && !uri.host.nil?
  rescue URI::InvalidURIError
    false
  end
end
