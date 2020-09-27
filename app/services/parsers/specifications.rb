# frozen_string_literal: true

module Parsers
  ###
  # @description: This class contains all the operations related to parse a specification
  #   Particularly, at this stage we deal with Ruby objects. It might be simple or relatively
  #   complex objects, hence the operations needed to process it.
  ###
  class Specifications
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
  end
end
