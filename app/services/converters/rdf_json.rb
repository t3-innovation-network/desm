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
      # check if file is JSONSchema
      return JsonSchema.convert(file) if json_schema?(file)

      reader = RDF::JSON::Reader.open(file.path)
      graph = RDF::Graph.new << reader
      expanded_resources = JSON::LD::API.fromRdf(graph)
      context = reader.prefixes.to_h { |key, term| [key.to_s, term.value] }
      JSON::LD::API.compact(expanded_resources, context).symbolize_keys
    rescue StandardError
      file_content = File.read(file)
      JSON.parse(file_content)
    end

    def self.json_schema?(file)
      file_content = File.read(file.path)
      json = JSON.parse(file_content)
      json.is_a?(Hash) && json.key?("$schema") && json["$schema"].include?("json-schema.org")
    rescue JSON::ParserError
      false
    end

    def self.read(path)
      JSON(File.read(path))
      true
    rescue JSON::ParserError
      raise Converters::ParseError
    end
  end
end
