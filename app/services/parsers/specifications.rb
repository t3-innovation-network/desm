# frozen_string_literal: true

module Parsers
  ###
  # @description: This class contains all the operations related to parse a specification
  #   Particularly, at this stage we deal with Ruby objects. It might be simple or relatively
  #   complex objects, hence the operations needed to process it.
  ###
  class Specifications
    include Connectable
    ###
    # @description: Read an attribute from a node and return it's content as String
    # @param [Hash] node: The node to being evaluated
    # @param [String] attribute_name: The node to be evaluated
    # @return [String]
    ###
    def self.read!(node, attribute_name)
      key = find_node_key(node, attribute_name)

      return "" unless node.key?(key)

      return node[key]["@value"] if valid_node_key?(node[key], "@value")

      return node[key]["en-US"] if valid_node_key?(node[key], "en-US")

      node[key]
    end

    ###
    # @description: Read an attribute from a node and return it's content as it is
    # @param [Hash] node: The node to be evaluated
    # @param [String] attribute_name: The node to be evaluated
    # @return [String|Hash]
    ###
    def self.read(node, attribute_name)
      key = find_node_key(node, attribute_name)

      node[key]
    end

    ###
    # @description: Read an attribute from a node and return it's content as an array
    # @param [Hash] node: The node to be evaluated
    # @param [String] attribute_name: The node to be evaluated
    # @return [Array]
    ###
    def self.read_as_array(node, attribute_name)
      val = read(node, attribute_name)

      Array(val)
    end

    ###
    # @description: Find the first node attribute which the key contains the string given
    #   as the name of the attribute to read
    # @param [Hash] node: The node to be evaluated
    # @param [String] attribute_name: The node to be evaluated
    # @return [Object]
    ###
    def self.find_node_key(node, attribute_name)
      node.select {|key| key.to_s.downcase.match(Regexp.new(attribute_name.downcase)) }.keys.first
    end

    ###
    # @description: Validates whether a node contains a key
    # @param [Hash] node: The node being evaluated
    # @param [String] key: The key to evaulate against the node
    # @return [TrueClass|FalseClass]
    ###
    def self.valid_node_key?(node, key)
      node.is_a?(Hash) && node.key?(key)
    end

    ###
    # @description: If the context is a reference to an external service endpoint, go get it
    # @param [String] context_uri: The URI to fetch the context from
    # @return {Struct}
    ###
    def self.resolve_context context_uri
      # Try resolving with an http request
      response = http_get(context_uri)

      # Avoid having the context nested twice
      return response["@context"] if response && response["@context"].present?

      response
    end

    ###
    # @description: Put together the content of the uploaded files to get only one object with
    #   all the necessary data to process
    # @param [Array] specifications: The list of file contents uploaded
    # @return [Object]: The unified specification
    ###
    def self.merge_specs specifications
      final_spec = {
        "@context": {},
        "@graph": []
      }

      specifications.each do |spec|
        spec = JSON.parse(spec) if spec.is_a?(String)

        context = spec["@context"]

        # Ensure we're dealing with a hash, otherwise the "merge!" method below will not work
        context = resolve_context(context) if context.is_a?(String) && uri?(context)

        # merge the context so we have all the context info
        final_spec[:@context].merge!(context) if context

        # merge the graph so we have all the elements in one place
        final_spec[:@graph] += (spec["@graph"])
      end

      final_spec
    end
  end
end
