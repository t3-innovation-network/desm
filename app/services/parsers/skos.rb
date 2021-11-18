# frozen_string_literal: true

module Parsers
  class Skos < Specification
    attr_accessor :graph, :context

    def initialize args={}
      @context = args.fetch(:context, {})
      @graph = args.fetch(:graph, {})
      file_content = args.fetch(:file_content, nil)
      super(file_content: file_content) if file_content
    end

    ###
    # @description: Handles the construction of a vocabulary skos structure with a context and a graph of concepts from
    #   a given scheme node. It will look into the graph for all those related nodes, filtering to exclude nodes of
    #   different types and concept nodes not applicable to the selected scheme node.
    #
    # @param [Object] scheme_node: The scheme node containing the uri of the related concepts
    # @return [Hash]
    ###
    def build_vocabulary scheme_node
      vocab = {
        "@context": nil,
        # Get all the concepts for this concept scheme
        "@graph": identify_concepts(scheme_node)
      }

      # Place the context at the beginning
      vocab[:@context] = filter_context(vocab[:@graph])

      # Place the scheme node at the beginning
      vocab[:@graph].unshift(scheme_node)

      vocab
    end

    ###
    # @description: Defines a readable list of concepts in order to operate the same way with different vocabularies,
    #   no matter the origin of it
    ###
    def concepts_list_simplified
      @graph.map {|node|
        parser = Parsers::JsonLd::Node.new(node)

        {
          id: parser.read!("key"),
          uri: parser.read!("id"),
          name: parser.read!("label"),
          definition: parser.read!("description") || parser.read!("definition") || parser.read!("comment")
        }
      }
    end

    ###
    # @description: Returns all those nodes that are not skos types (concepts or concept schemes)
    # @return [Array]
    ###
    def exclude_skos_types
      @graph.reject {|node|
        Parsers::JsonLd::Node.new(node).types.skos_type?
      }
    end

    ###
    # @description: Returns all the concept scheme nodes (vocabulary "main" nodes)
    # @return [Array]
    ###
    def scheme_nodes
      @graph.select {|node|
        Parsers::JsonLd::Node.new(node).types.concept_scheme?
      }
    end

    private

    ###
    # @description: Get the concept nodes belonging to a concept scheme by reading the children list
    # @param [Hash] The concept scheme node
    # @return [Array] A collection of uris to identify the child concept nodes
    ###
    def child_concepts_uris concept_scheme_node
      parser = Parsers::JsonLd::Node.new(concept_scheme_node)
      child_nodes = Array(parser.read!("hasConcept"))

      # Some specification may not use "hasConcept", but "hasTopConcept"
      child_nodes = Array(parser.read!("hasTopConcept")) if child_nodes.all?(&:empty?)

      raise "No concept nodes found for Vocabulary #{parser.read!('id')}" if child_nodes.all?(&:empty?)

      process_node_uris(child_nodes)
    end

    ###
    # @description: Filter a collection of nodes of any type to get a new collection of only those nodes of
    #   type "skos:concept".
    # @return [Array] A collection of only nodes of type "skos:concept".
    ###
    def concept_nodes
      @graph.select {|node|
        Array(Parsers::JsonLd::Node.new(node).read!("type")).any? {|type|
          type.downcase.include?("concept") && !type.downcase.include?("conceptscheme")
        }
      }
    end

    ###
    # @description: Generate a list of uris defined in a context (e.g. "rdf", "rdfs", "xsd")
    # @return [Array]
    ###
    def context_uris_list
      @context.keys.map do |key|
        key.split(":").first
      end
    end

    ###
    # @description: From a wide context, generate a new one, containing only the keys that are needed for the
    #   given vocabulary
    #
    # @param [Array] vocab_graph: The vocabulary graph to be analyzed
    # @return [Hash] context: The wider context to be used as context source
    ###
    def filter_context vocab_graph
      final_context = {}

      # We only have concepts at this point, so accessing the graph is fine.
      # Proceed to iterate through each concept in the graph
      vocab_graph.each do |concept|
        # Each concept will have different keys (here, the concepts are represented as hashes)
        # We iterate through each key of the concept, which represents each "attribute"
        concept.keys.each do |attr_key|
          # We are only interested in those keys that uses the uris from the main context
          # If so, we add the key and value to our new context
          if using_context_uri(attr_key)
            k, v = @context.find {|key, _value| key.include?(attr_key.split(":").first) }
            final_context[k] = v
          end
        end
      end

      final_context
    end

    ###
    # @description: Identify all the concepts for a given vocabulary id (scheme uri).
    # @param [Object] scheme_node: The scheme node containing the uri of the related concepts
    # @return [Array]
    ###
    def identify_concepts scheme_node
      child_concepts_uris(scheme_node).map {|concept_uri|
        concept_nodes.find {|c_node|
          Parsers::JsonLd::Node.new(c_node)&.read!("id")&.downcase&.eql?(concept_uri.downcase)
        }
      }
    end

    ###
    # @description: Process an array of uris to ensure returning an  array of string uris. It might
    #   contain an array of objects with its uri's in it.
    # @param [Array] nodes
    # @return [Array]
    ###
    def process_node_uris nodes
      nodes.map {|node|
        if node.is_a?(String)
          node
        else
          node.is_a?(Hash) && (node["@id"] || node[:@id]) ? (node["@id"] || node[:@id]) : nil
        end
      }
    end

    ###
    # @description: Determines whether a key (an attribute of a node) id using a uri that's defined inside a context
    # @param [Hash] context.
    # @param [String] attribute_key
    # @return [TrueClass|FalseClass]
    ###
    def using_context_uri(attribute_key)
      context_uris_list.include?(attribute_key.split(":").first)
    end
  end
end
