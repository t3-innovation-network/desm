# frozen_string_literal: true

class Utils
  ##
  # Compacts a full URI.
  #
  # @param uri [String]
  # @param context [Hash]
  # @return [String|nil]
  #   If the `uri` is a compact URI, returns it as is.
  #   If the `uri` is a DESM URI, returns the value from which it was generated.
  #   If the `uri` belongs to a namespace from the `context`, returns its compact version.
  #   Otherwise, returns `nil`.
  def self.compact_uri(uri, context: Desm::CONTEXT)
    return uri unless uri.start_with?("http")
    return URI(uri).path.split("/").last if uri.start_with?(Desm::DESM_NAMESPACE.to_s)

    context.each do |prefix, namespace|
      next unless namespace.is_a?(String)
      return uri.sub(namespace, "#{prefix}:") if uri.start_with?(namespace)
    end

    nil
  end
end
