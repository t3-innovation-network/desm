# frozen_string_literal: true

module Converters
  # Converts a Turtle specification to the JSON-LD format
  class Turtle
    ##
    # Converts a file to the JSON-LD format.
    #
    # @param file [#path]
    # @return [Hash]
    def self.convert(file)
      reader = RDF::Turtle::Reader.open(file.path)
      graph = RDF::Graph.new << reader
      expanded_resources = JSON::LD::API.fromRdf(graph)
      context = reader.prefixes.filter_map { |k, v| [k.to_s, v.value] if k }.to_h
      JSON::LD::API.compact(expanded_resources, context).symbolize_keys
    end

    def self.read(path)
      reader = RDF::Turtle::Reader.open(path)
      raise Converters::ParseError unless reader.valid?

      true
    end
  end
end
