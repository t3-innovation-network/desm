# frozen_string_literal: true

module Converters
  # Converts an RDF/XML specification to the JSON-LD format
  class RdfXml
    ##
    # Converts a file to the JSON-LD format.
    #
    # @param file [#path]
    # @return [Hash]
    def self.convert(file)
      reader = RDF::RDFXML::Reader.open(file.path)
      graph = RDF::Graph.new << reader
      expanded_resources = JSON::LD::API.fromRdf(graph)
      # select namespaces from the root element with not nil keys
      context = reader.root.namespaces.select { |k, _v| k.present? }
      JSON::LD::API.compact(expanded_resources, context).symbolize_keys
    end

    def self.read(path)
      reader = RDF::RDFXML::Reader.open(path)
      raise Converters::ParseError unless reader.valid? && reader.root.present?

      true
    end
  end
end
