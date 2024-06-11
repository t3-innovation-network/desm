# frozen_string_literal: true

module Parsers
  module JsonLd
    ###
    # @description: Represents a node in a json ld specification representation.
    ###
    class Node
      include NodeTypes

      attr_accessor :types, :context

      def initialize(node, context = {})
        @node = node
        @context = context
        @types = TypeSet.new(node_types)
      end

      ###
      # @description: Read an attribute from a node and return it's content as String
      # @param [String] attribute_name: The node to be evaluated
      # @return [String]
      ###
      def read!(attribute_name)
        # Use approximation to get the exact key we're going to read in the hash
        key = find_node_key(attribute_name)

        # If we can't find the key, return an empty string
        return nil unless @node.key?(key)

        # Read the value, safely, it can be an array, so we ensure we can read it
        val = @node[key].is_a?(Array) && @node[key].one? ? @node[key].first : @node[key]

        # What we have now, can be the final result (what we were looking for), or it can
        # still be a hash, so we read it again.
        val.is_a?(Hash) ? node_value(val) : val
      end

      ###
      # @description: Read an attribute from a node and return it's content as an array
      # @param [String] attribute_name: The node to be evaluated
      # @return [Array]
      ###
      def read_as_array(attribute_name)
        node_attribute = read!(attribute_name)
        values = Array(node_attribute) unless node_attribute.is_a?(Hash)
        values = node_attribute.values if node_attribute.is_a?(Hash)

        # We need the string values, each of it could be surrounded by "@id" key as an object
        values.map { |value| (value.is_a?(Hash) && (value[:@id] || value["@id"])) || value }
      end

      ###
      # @description: Read a language map attribute from a node and return its content as an array
      # @param [Array, Hash, String] attribute_name: The node to be evaluated
      # @return [Array]
      ###
      def read_as_language_map(attribute_name)
        parse_language_map_node(read!(attribute_name)).flatten.compact
      end

      ###
      # @description: See if the property is related to a given node by id (URI)
      # @param [String] uri The identifier of the original node to compare
      ###
      def related_to_node_by?(related_key, uri)
        # Infer the key name by proximity
        key = @node.select { |k| k.to_s.match(Regexp.new(related_key)) }.keys.first

        # Get the related nodes, one of these can be the one we're processing
        related_nodes = @node[key]

        # Ensure we're dealing with array (when it's only 1 it can be a single object)
        related_nodes = [related_nodes] if related_nodes.present? && !related_nodes.is_a?(Array)

        related_nodes.present? && related_nodes.any? do |d|
          uri_eql?(d, uri)
        end
      end

      ###
      # @description: Returns the rdfs:Class node this node represents. If it's a property but
      #   there's a class referenced in the type key, return that node. If this node itself
      #   represents an rdfs:Class, just return the node.
      ###
      def rdfs_class_nodes
        return [] unless types.rdf_property?

        domains = Array.wrap(read!("domain").presence || read!("domainIncludes"))
        return [{ "@id" => "rdfs:Resource", "rdfs:label" => "Resource" }] if domains.empty?

        nodes = domains.map do |domain|
          uri = domain.is_a?(Hash) ? domain["@id"] : domain
          next unless uri.present?

          {
            "@id" => uri,
            "rdfs:label" => uri.split(%r{[#/:]}).last.titleize
          }
        end

        nodes.compact
      end

      def id_to_name
        name = read!("id").sub(%r{^https?://(www.)?}, "").gsub(%r{[.:/]}, "_")
        name.underscore.camelcase
      end

      private

      ###
      # @description: Find the first node attribute which the key contains the string given
      #   as the name of the attribute to read
      # @param [String] attribute_name: The node to be evaluated
      # @return [Object]
      ###
      def find_node_key(attribute_name)
        selected_node = @node.select do |key|
          key.to_s.camelize.downcase.match(
            Regexp.new(attribute_name.downcase)
          )
        end

        selected_node = selected_node.first if selected_node.is_a?(Array) && selected_node.first.is_a?(Hash)

        selected_node.keys.first
      end

      ###
      # @description: Uses the internet or local DB to fetch the node type definition and determine
      #   if it is or not an rdfs:Class
      ###
      def infer_rdfs_class_node
        # In most of the cases, we will deal with nodes with only 1 type. but it might be the
        # case of a node with more than 1 type (2 at most). So we need to be prepared.
        rdf_nodes = []

        @types.types_list.each do |type|
          resolver = Parsers::JsonLd::Resolver.new(type, @context)

          # Try fetching the internal DB
          rdf_node = RdfsClassNode.find_by_uri(resolver.full_definition_uri)&.definition
          # If not, fetch via definition (use the internet)
          rdf_node ||= resolver.infer_rdfs_class_node

          rdf_nodes << rdf_node
        end

        # From this method's first line comment, the most of the cases it'll just be only 1 type
        # But we need to be prepared.
        rdf_nodes.first
      end

      ###
      # @description: Reads the node to return its type
      # @return [Array]
      ###
      def node_types
        @node = @node.first if @node.is_a?(Array) && @node.first.is_a?(Hash)

        types_array = read_as_array("type")
        expanded_types = []

        types_array.each do |t|
          # It's a contracted form URI, like "asn:Statement", we need to include the resolved,
          # expanded version so we can compare safely
          if t.split(":").count.eql?(2)
            resolver = Parsers::JsonLd::Resolver.new(t, @context)
            expanded_types << resolver.full_definition_uri
          end
        end

        (types_array + expanded_types).uniq
      end

      ###
      # @description: Reads the value of a node, assuming it's a final depth node. E.g. the
      #   only value to read in depth left is a key in the hash called value, title, or a
      #   lang key like en-us.
      # @param [Hash] node
      # @return [String]
      ###
      def node_value(node)
        node = node.with_indifferent_access

        return node[:@value] if valid_node_key?(node, :@value)

        lang_value = node["en-US"] || node["en-us"] || node["en_us"] || node["enUS"]

        lang_value || node
      end

      ###
      # @description: Determines if a node uri is equal to a given uri
      # @param node [Hash|String]
      # @param uri [String]
      # @return [TrueClass|FalseClass]
      ###
      def uri_eql?(node, uri)
        node["id"] == uri || node["@id"] == uri || node == uri
      end

      ###
      # @description: Validates whether a node contains a key
      # @param [Hash] node: The node being evaluated
      # @param [String] key: The key to evaluate against the node
      # @return [TrueClass|FalseClass]
      ###
      def valid_node_key?(node, key)
        node.is_a?(Hash) && (node.key?(key) || node.key?(key.downcase))
      end

      def parse_language_map_node(node)
        values =
          if node.is_a?(Array)
            node
          elsif node.is_a?(Hash)
            if node.key?("@value")
              [node.fetch("@value")]
            else
              node.values
            end
          else
            return [node]
          end

        values.map { parse_language_map_node(_1) }
      end
    end
  end
end
