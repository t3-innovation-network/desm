# frozen_string_literal: true

module Parsers
  module JsonLd
    class Resolver
      include NodeTypes
      include Connectable
      include SchemeDefinitionFetchable

      attr_accessor :full_definition_uri

      SEPARATOR = ":"

      def initialize(type, context = {})
        @type = type
        @context = context
        @context = resolve_context if @context.is_a?(String) && uri?(@context)
        @context = @context.with_indifferent_access

        build_type_name
        build_full_definition_uri
      end

      def infer_rdfs_class_node
        json_definition = fetch_definition(@full_definition_uri)
        return unless json_definition[:@graph].present?

        node_in_definition = find_original_node_in_fetched_definition(json_definition[:@graph])

        return unless !node_in_definition.nil? &&
                      Parsers::JsonLd::Node.new(node_in_definition).types.rdfs_class?

        node_definition_from_db(node_in_definition)
      end

      private

      def build_full_definition_uri
        @full_definition_uri = @type

        return if uri?(@type)

        prefix = @type.split(SEPARATOR).first

        @full_definition_uri = @context[prefix] + @type_name if @context[prefix].present?

        @full_definition_uri
      end

      def build_type_name
        @type_name = @type.split("/").last if uri?(@type)

        return if uri?(@type)

        @type_name = @type.split(SEPARATOR).last
      end

      def find_original_node_in_fetched_definition(graph)
        graph.find do |node|
          remove_protocol_from_uri(
            Parsers::JsonLd::Node.new(node).read!("id")
          )&.eql?(
            remove_protocol_from_uri(@full_definition_uri)
          )
        end
      end

      def node_definition_from_db(node_in_definition)
        node = RdfsClassNode.find_or_initialize_by(
          uri: @full_definition_uri
        ) do |n|
          n.update!(definition: node_in_definition)
        end

        node.definition
      end

      def remove_protocol_from_uri(uri)
        uri.sub(%r{^https?://(www.)?}, "")
      end
    end
  end
end
