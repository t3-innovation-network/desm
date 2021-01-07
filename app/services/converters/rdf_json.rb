# frozen_string_literal: true

module Converters
  # Converts a Json Schema specification to the JSON-LD format
  class RdfJson
    ##
    # Converts a file to the JSON-LD format.
    #
    # @param file [#path]
    # @return [Hash]
    def self.convert(file)
      reader = RDF::JSON::Reader.open(file.path)
      graph = RDF::Graph.new << reader
      expanded_resources = JSON::LD::API.fromRdf(graph)
      context = reader.prefixes.map {|key, term| [key.to_s, term.value] }.to_h
      JSON::LD::API.compact(expanded_resources, context).symbolize_keys
    rescue StandardError
      File.read(file)
    end
  end
end
