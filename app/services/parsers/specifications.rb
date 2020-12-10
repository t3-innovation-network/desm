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
      # Use approximation to get the exact key we're going to read in the hash
      key = find_node_key(node, attribute_name)

      # If we can't find the key, return an empty string
      return "" unless node.key?(key)

      # Read the value, safely, it can be an array, so we ensure we can read it
      val = node[key].is_a?(Array) && node[key].one? ? node[key].first : node[key]

      # What we have now, can be the final result (what we were looking for), or it can
      # still be a hash, so we read it again.
      val.is_a?(Hash) ? node_value(val) : val
    end

    ###
    # @description: Reads the vaule of a node, assuming it's a final depth node. E.g. the
    #   only value to read in depth left is a key in the hash called value, title, or a
    #   lang key like en-us.
    # @param [Hash] node
    # @return [String]
    ###
    def self.node_value node
      node = node.with_indifferent_access

      return node[:@value] if valid_node_key?(node, :@value)

      lang_value = node["en-US"] || node["en-us"]

      lang_value || node
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
      node_attribute = read(node, attribute_name)
      values = Array(node_attribute) unless node_attribute.is_a?(Hash)
      values = node_attribute.values if node_attribute.is_a?(Hash)

      # We need the string values, each of it could be sorrounded by "@id" key as an object
      values.map {|value| (value.is_a?(Hash) && (value[:@id] || value["@id"])) || value }
    end

    ###
    # @description: Find the first node attribute which the key contains the string given
    #   as the name of the attribute to read
    # @param [Hash] node: The node to be evaluated
    # @param [String] attribute_name: The node to be evaluated
    # @return [Object]
    ###
    def self.find_node_key(node, attribute_name)
      selected_node = node.select {|key|
        key.to_s.downcase.match(
          Regexp.new(attribute_name.downcase)
        )
      }

      selected_node = selected_node.first if selected_node.is_a?(Array) && selected_node.first.is_a?(Hash)

      selected_node.keys.first
    end

    ###
    # @description: Validates whether a node contains a key
    # @param [Hash] node: The node being evaluated
    # @param [String] key: The key to evaulate against the node
    # @return [TrueClass|FalseClass]
    ###
    def self.valid_node_key?(node, key)
      node.is_a?(Hash) && (node.key?(key) || node.key?(key.downcase))
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
        spec = validate_spec_format(spec)

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

    ###
    # @description: We will work only with a json-ld file that contains both a '@context' and a '@graph'.
    #   - CASE A: It can be the case of a file only containing a graph (without a context), so we set the context
    #   to an empty entry.
    #   - CASE B: It also might be possible to deal with a file with only nodes (an array of terms of any type),
    #   so we both set the context as an empty entry and wrap the whole array into a '@graph' key.
    # @param [String|Hash] spec
    # @return [Hash]
    ###
    def self.validate_spec_format spec
      spec = JSON.parse(spec) if spec.is_a?(String)

      # CASE A
      spec["@context"] = {} if spec.is_a?(Hash) && !spec["@context"].present?

      # CASE B
      if spec.is_a?(Array)
        spec = {
          "@context": {},
          "@graph": spec
        }
      end

      spec.with_indifferent_access
    end
  end
end
