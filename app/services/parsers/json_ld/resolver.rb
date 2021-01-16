# frozen_string_literal: true

module Parsers
  module JsonLd
    class Resolver
      include NodeTypes
      include Connectable

      attr_accessor :full_definition_uri

      SEPARATOR = ":"

      def initialize(type, context)
        @type = type
        @context = context

        build_type_name
        build_full_definition_uri
      end

      ###
      # @description: Get the rdfs:Class node from the definition in the internet, if possible
      ###
      def infer_rdfs_class_node
        validate_context
        # Get the definition from the internet
        repository = RDF::Repository.load(@full_definition_uri)

        # Transform the definition to RDF-JSON
        json_definition = rdf_to_json_definition(repository.to_rdf_json)

        # Find the node we are looking for in the definition
        node_in_definition = json_definition[:@graph].find {|node| node["@id"]&.include?(@type_name) }

        return if node_in_definition.nil?

        return unless Parsers::JsonLd::Node.new(node_in_definition).types.rdfs_class?

        # Save the node in the local DB if it's an rdfs:Class, and return it
        node = RdfsClassNode.create!(
          uri: @full_definition_uri,
          definition: node_in_definition
        )

        node.definition
      end

      private

      ###
      # @description: Get a json ld version of the definition to work with
      # @param [Hash] rdf_json_definition
      ###
      def rdf_to_json_definition rdf_json_definition
        file = Tempfile.new(@type_name)
        file.write(rdf_json_definition.to_json)
        file.rewind

        Converters::RdfJson.convert(file)
      end

      ###
      # @description: Validate the presence of context to resolve
      ###
      def validate_context
        raise "No context provided for node" unless @context
      end

      ###
      # @description: Generates a full uri to get the type from
      ###
      def build_full_definition_uri
        @full_definition_uri = @type

        # We don't want to continue processing if we've already have a valid URI
        return if uri?(@type)

        # Instantiate the prefix, it's the first part of the string type
        # e.g. "asn:Statement" -> "asn"
        prefix = @type.split(SEPARATOR).first

        # Check whether we have the value for the prefix in the provided context
        if @context[prefix].present?
          # Build the full URI using the value for the prefix in the context, and the
          # second part of the string type
          @full_definition_uri = @context[prefix] + @type_name
        end

        @full_definition_uri
      end

      ###
      # @description: Generates the name of the type, isolated from the URI
      ###
      def build_type_name
        @type_name = @type.split("/").last if uri?(@type)

        return if uri?(@type)

        @type_name = @type.split(SEPARATOR).last
      end
    end
  end
end
