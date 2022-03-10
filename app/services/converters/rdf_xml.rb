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
      context = reader.root.namespaces
      JSON::LD::API.compact(expanded_resources, context).symbolize_keys
    end

    def self.read(path)
      reader = RDF::RDFXML::Reader.open(path)
      raise Converters::ParseError unless reader.valid?

      true
    end
  end
end
