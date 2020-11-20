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
          Parsers::Specifications.read!(concept, "type").downcase == "skos:concept"
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
          content: data[:attrs][:content]["@graph"].find {|concept|
            Parsers::Specifications.read!(concept, "type").downcase == "skos:conceptscheme"
          }
        )
      end
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
    # @param [String] scheme_uri: The id of the scheme containing the concepts
    # @return [Array]
    ###
    def self.identify_concepts graph, scheme_uri
      concepts = []

      # Get only the concept nodes (avoid processing the properties, classes, or concept schemes)
      concept_nodes = graph.select {|node|
        Parsers::Specifications.read!(node, "type").downcase == "skos:concept"
      }

      # Process each concept to add the correct ones to the current vocabulary being processed
      concept_nodes.each do |node|
        concepts << node if concept_of_scheme?(node, scheme_uri)
      end

      concepts
    end

    ###
    # @description: Determines whether a concept belongs to a concept scheme or not
    # @param [Hash] node
    # @param [String] scheme_uri
    # @return [TrueClass|FalseClass]
    ###
    def self.concept_of_scheme?(node, scheme_uri)
      return false unless node["skos:inScheme"].present?

      Array(node["skos:inScheme"]).any? {|s_uri| s_uri == scheme_uri }
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
        Parsers::Specifications.read!(node, "type").is_a?(String) &&
        Parsers::Specifications.read!(node, "type").downcase == "skos:conceptscheme"
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
