# frozen_string_literal: true

module Processors
  ###
  # @description: Process skos files and create skos concept schemes with its corresponding
  #   skos concepts as a graph
  ###
  class Skos
    attr_reader :file_content, :graph, :concept_nodes

    def initialize file
      @file_content =
        if file.is_a?(String)
          JSON.parse(file)
        else
          file
        end

      @graph = @file_content["@graph"]
      @concept_nodes = filter_concept_nodes
    end

    ###
    # @description: Filter a collection of nodes of any type to get a new collection of only those nodes of
    #   type "skos:concept".
    # @param [Array] graph The graph containing all the Properties, Classes, Concepts, Concept Scheme nodes
    #   and more.
    # @return [Array] A collection of only nodes of type "skos:concept".
    ###
    def filter_concept_nodes
      @graph.select {|node|
        Array(Parsers::Specifications.read!(node, "type")).any? {|type|
          type.downcase.include?("concept") && !type.downcase.include?("conceptscheme")
        }
      }
    end

    ###
    # @description: Returns the first concept scheme in a graph. Useful for when we have a single
    #   vocabulary and need only the concept scheme node.
    # @return [Hash]
    ###
    def first_concept_scheme_node
      @graph.find {|concept|
        Parsers::Specifications.read!(concept, "type").downcase.include?("conceptscheme")
      }.with_indifferent_access
    end

    ###
    # @description: Identify all the concepts for a given vocabulary id (scheme uri).
    # @param [Object] scheme_node: The scheme node containing the uri of the related concepts
    # @return [Array]
    ###
    def identify_concepts scheme_node
      child_concepts_uris(scheme_node).map {|concept_uri|
        @concept_nodes.find {|c_node|
          Parsers::Specifications.read!(c_node, "id").downcase == concept_uri.downcase
        }
      }
    end

    ###
    # @description: Returns all the concept scheme nodes (vocabulary "main" nodes)
    # @return [Array]
    ###
    def scheme_nodes
      @graph.select {|node|
        Array(Parsers::Specifications.read!(node, "type")).any? {|type|
          type.downcase.include?("conceptscheme")
        }
      }
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

    ###
    # @description: Returns all those nodes that are not skos types (concepts or concept schemes)
    # @param [Array] graph: An array of hashes, representing the nodes, that could be any "@type",
    #   like "rdfsClass", "rdf:Property", among others
    # @return [Array]
    ###
    def self.exclude_skos_types(graph)
      graph.reject {|node|
        Array(Parsers::Specifications.read!(node, "type")).any? {|type|
          type.downcase.include?("conceptscheme") || type.downcase.include?("concept")
        }
      }
    end

    private

    ###
    # @description: Get the concept nodes belonging to a concept scheme by reading the childs list
    # @param [Hash] The concept scheme node
    # @return [Array] A collection of uris to identify the child concept nodes
    ###
    def child_concepts_uris concept_scheme_node
      child_nodes = Array(Parsers::Specifications.read!(concept_scheme_node, "hasConcept"))

      # Some specification may not use "hasConcept", but "hasTopConcept"
      if child_nodes.all?(&:empty?)
        child_nodes = Array(Parsers::Specifications.read!(concept_scheme_node, "hasTopConcept"))
      end

      if child_nodes.all?(&:empty?)
        raise "No concept nodes found for Vocabulary #{Parsers::Specifications.read!(concept_scheme_node, 'id')}"
      end

      process_node_uris(child_nodes)
    end

    ###
    # @description: Generate a list of uris defined in a context (e.g. "rdf", "rdfs", "xsd")
    # @param [Hash] context: The context to be evaluated
    # @return [Array]
    ###
    def context_uris_list context
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
    def process_node_uris nodes
      nodes.map {|node|
        if node.is_a?(String)
          node
        else
          node.is_a?(Hash) && (node["@id"] || node[:@id]) ? (node["@id"] || node[:@id]) : nil
        end
      }
    end
  end
end
