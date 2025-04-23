# frozen_string_literal: true

class Utils
  ##
  # Compacts a full URI.
  #
  # @param uri [String]
  # @param context [Hash]
  # @param non_rdf
  # @return [String|nil]
  #   If the `uri` is a compact URI, returns it as is.
  #   If the `uri` is a DESM URI and `non_rdf` is true,
  #     returns the value from which it was generated,
  #     otherwise returns the original value
  #   If the `uri` belongs to a namespace from the `context`, returns its compact version.
  #   Otherwise, returns `nil`.
  def self.compact_uri(uri, context: Desm::CONTEXT, non_rdf: true)
    return uri unless uri.start_with?("http")

    if uri.start_with?(Desm::DESM_NAMESPACE.to_s)
      return non_rdf ? URI(uri).path.split("/").last : uri
    end

    context.each do |prefix, namespace|
      next unless namespace.is_a?(String)
      return uri.sub(namespace, "#{prefix}:") if uri.start_with?(namespace)
    end

    uri
  end
end
