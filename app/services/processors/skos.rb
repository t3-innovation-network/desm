# frozen_string_literal: true

module Processors
  ###
  # @description: Process skos files and create skos concept schemes with its corresponding
  #   skos concepts as a graph
  ###
  class Skos
    attr_reader :file_content, :graph, :concept_nodes

    def initialize(file)
      @file_content =
        if file.is_a?(String)
          JSON.parse(file)
        else
          file
        end

      @file_content = @file_content.with_indifferent_access
      @graph = @file_content["@graph"]
      @context = @file_content["@context"]
      @concept_nodes = filter_concept_nodes
    end

    protected

    ###
    # @description: Returns the first concept scheme in a graph. Useful for when we have a single
    #   vocabulary and need only the concept scheme node.
    # @return [Hash]
    ###
    def first_concept_scheme_node
      Parsers::Skos.new(graph: @graph).scheme_nodes.first.with_indifferent_access
    end

    ###
    # @description: Determines whether a key (an attribute of a node) id using a uri that's defined inside a context
    # @param [Hash] context.
    # @param [String] attribute_key
    # @return [TrueClass|FalseClass]
    ###
    def using_context_uri(context, attribute_key)
      context_uris_list(context).include?(attribute_key.split(":").first)
    end

    private

    ###
    # @description: Filter a collection of nodes of any type to get a new collection of only those nodes of
    #   type "skos:concept".
    # @param [Array] graph The graph containing all the Properties, Classes, Concepts, Concept Scheme nodes
    #   and more.
    # @return [Array] A collection of only nodes of type "skos:concept".
    ###
    def filter_concept_nodes
      @graph.select do |node|
        Parsers::JsonLd::Node.new(node).types.concept?
      end
    end

    ###
    # @description: Generate a list of uris defined in a context (e.g. "rdf", "rdfs", "xsd")
    # @param [Hash] context: The context to be evaluated
    # @return [Array]
    ###
    def context_uris_list(context)
      context.keys.map do |key|
        key.split(":").first
      end
    end

    ###
    # @description: Process an array of uris to ensure returning an  array of string uris. It might
    #   contain an array of objects with its uri's in it.
    # @param [Array] nodes
    # @return [Array]
    ###
    def process_node_uris(nodes)
      nodes.map do |node|
        if node.is_a?(String)
          node
        else
          node.is_a?(Hash) && (node["@id"] || node[:@id]) ? (node["@id"] || node[:@id]) : nil
        end
      end
    end
  end
end
