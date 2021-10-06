# frozen_string_literal: true

module Converters
  class RdfParseError; end

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
  end

  def self.read(_path)
    reader = RDF::RDFXML::Reader.open(file.path)
    raise RdfParseError unless reader.valid?

    true
  end
end
