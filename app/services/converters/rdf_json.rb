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
      context = reader.prefixes.to_h { |key, term| [key.to_s, term.value] }
      JSON::LD::API.compact(expanded_resources, context).symbolize_keys
    rescue StandardError
      file_content = File.read(file)
      JSON.parse(file_content)
    end

    def self.read(path)
      JSON(File.read(path))
      true
    rescue JSON::ParserError
      raise Converters::ParseError
    end
  end
end
