# frozen_string_literal: true

module Processors
  ###
  # @description: Process skos files and create skos concept schemes with its corresponding
  #   skos concepts as a graph
  ###
  class Skos
    ###
    # @description: Creates a concept scheme from a raw json content
    # @param {Hash} data: The necessary data we need in order to create a concept scheme:
    #   - An organization
    #   - and an skos file in json-ld format
    # @return {Vocabulary}: The created vocabulary
    ###
    def self.create data
      @vocabulary = create_vocabulary(data)

      @vocabulary.concepts = create_concepts(
        data[:attrs][:content]["@graph"].select {|concept|
          Array(Parsers::Specifications.read!(concept, "type")).any? {|type|
            type.downcase.include?("concept") && !type.downcase.include?("conceptscheme")
          }
        }
      )

      @vocabulary
    end

    ###
    # @description: Creates a single vocabulary. This should be in an skos format in the data[:raw] parameter
    # @param {Hash} data: The necessary data we need in order to create a concept scheme:
    #   - An organization
    #   - and an skos file in json-ld format
    # @return {Vocabulary}: The created vocabulary
    ###
    def self.create_vocabulary data
      @vocabulary = Vocabulary.find_or_initialize_by(name: data[:attrs][:name]) do |vocab|
        vocab.update(
          organization: data[:organization],
          context: data[:attrs][:content]["@context"],
          content: first_concept_scheme_node(data[:attrs][:content]["@graph"])
        )
      end
    end

    ###
    # @description: Returns the first concept scheme in a graph. Useful for when we have a single
    #   vocabulary and need only the concept scheme node.
    # @param [Array] graph
    # @return [Hash]
    ###
    def self.first_concept_scheme_node graph
      graph.find {|concept|
        Parsers::Specifications.read!(concept, "type").downcase.include?("conceptscheme")
      }
    end

    ###
    # @description: Create concepts for a given concept scheme
    # @param {Array} concepts_list: The raw array of data (array of objects) for the concepts
    # @return {Array}: The array of Concepts
    ###
    def self.create_concepts concepts_list
      concepts_list.map do |concept|
        SkosConcept.find_or_initialize_by(
          uri: Parsers::Specifications.read!(concept, "id")
        ) {|c_concept|
          c_concept.update(
            raw: concept
          )
        }
      rescue StandardError => e
        Rails.logger.error(e.inspect)
        SkosConcept.find_by_uri(Parsers::Specifications.read!(concept, "id"))
      end
    end

    ###
    # @description: Identify all the concepts for a given vocabulary id (scheme uri).
    # @param [Array] graph: the collection of nodes. It can contain all kind of nodes, we will find only those with
    #   type "skos:Concept" and related to the given scheme.
    # @param [Object] scheme_node: The scheme node containing the uri of the related concepts
    # @return [Array]
    ###
    def self.identify_concepts graph, scheme_node
      concept_nodes = concept_nodes(graph)

      child_concepts_uris(scheme_node).map {|concept_uri|
        concept_nodes.find {|c_node|
          Parsers::Specifications.read!(c_node, "id").downcase == concept_uri.downcase
        }
      }
    end

    ###
    # @description: Filter a collection of nodes of any type to get a new collection of only those nodes of
    #   type "skos:concept".
    # @param [Array] graph The graph containing all the Properties, Classes, Concepts, Concept Scheme nodes
    #   and more.
    # @return [Array] A collection of only nodes of type "skos:concept".
    ###
    def self.concept_nodes graph
      graph.select {|node|
        Array(Parsers::Specifications.read!(node, "type")).any? {|type|
          type.downcase.include?("concept") && !type.downcase.include?("conceptscheme")
        }
      }
    end

    ###
    # @description: Get the concept nodes belonging to a concept scheme by reading the childs list
    # @param [Hash] The concept scheme node
    # @return [Array] A collection of uris to identify the child concept nodes
    ###
    def self.child_concepts_uris concept_scheme_node
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
    # @description: Process an array of uris to ensure returning an  array of string uris. It might
    #   contain an array of objects with its uri's in it.
    # @param [Array] nodes
    # @return [Array]
    ###
    def self.process_node_uris nodes
      nodes.map {|node|
        if node.is_a?(String)
          node
        else
          node.is_a?(Hash) && (node["@id"] || node[:@id]) ? (node["@id"] || node[:@id]) : nil
        end
      }
    end

    ###
    # @description: Determines whether a concept belongs to a concept scheme or not
    # @param [Hash] node
    # @param [String] scheme_uri
    # @return [TrueClass|FalseClass]
    ###
    def self.concept_of_scheme?(node, scheme_uri)
      return false unless Parsers::Specifications.read!(node, "inScheme").present?

      Array(Parsers::Specifications.read!(node, "inScheme")).any? {|s_uri| s_uri == scheme_uri }
    end

    ###
    # @description: Generate a list of uris defined in a context (e.g. "rdf", "rdfs", "xsd")
    # @param [Hash] context: The context to be evaluated
    # @return [Array]
    ###
    def self.context_uris_list context
      context.keys.map do |key|
        key.split(":").first
      end
    end

    ###
    # @description: Returns all the concept scheme nodes (vocabulary "main" nodes)
    # @param [Array] graph: An array of hashes, representing the nodes, that could be any "@type",
    #   like "rdfsClass", "rdf:Property", among others
    # @return [Array]
    ###
    def self.scheme_nodes_from_graph(graph)
      graph.select {|node|
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
    def self.using_context_uri(context, attribute_key)
      context_uris_list(context).include?(attribute_key.split(":").first)
    end
  end
end
