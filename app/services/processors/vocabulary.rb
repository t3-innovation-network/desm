# frozen_string_literal: true

module Processors
  ###
  # @description: Process skos files and create skos concept schemes with its corresponding
  #   skos concepts as a graph
  ###
  class Vocabulary < Skos
    ###
    # @description: Creates a concept scheme from a raw json content
    # @param {Hash} data: The necessary data we need in order to create a concept scheme:
    #   - An organization
    #   - and an skos file in json-ld format
    # @return {Vocabulary}: The created vocabulary
    ###
    def create data
      @vocabulary = create_vocabulary(data)

      @vocabulary.concepts = create_concepts

      @vocabulary
    end

    ###
    # @description: Creates a single vocabulary. This should be in an skos format in the data[:raw] parameter
    # @param {Hash} data: The necessary data we need in order to create a concept scheme:
    #   - An organization
    #   - and an skos file in json-ld format
    # @return {Vocabulary}: The created vocabulary
    ###
    def create_vocabulary data
      @vocabulary = Vocabulary.find_or_initialize_by(name: data[:attrs][:name]) do |vocab|
        vocab.update(
          organization: data[:organization],
          context: data[:attrs][:content]["@context"],
          content: first_concept_scheme_node
        )
      end
    end

    ###
    # @description: Create concepts for a given concept scheme
    # @return {Array}: The array of Concepts
    ###
    def create_concepts
      concept_nodes.map do |concept|
        SkosConcept.find_or_initialize_by(
          uri: Parsers::JsonLd::Node.new(concept).read!("id")
        ) {|c_concept|
          c_concept.update(
            raw: concept
          )
        }
      rescue StandardError => e
        Rails.logger.error(e.inspect)
        SkosConcept.find_by_uri(Parsers::JsonLd::Node.new(concept).read!("id"))
      end
    end

    ###
    # @description: From a wide context, generate a new one, containing only the keys that are needed for the
    #   given vocabulary
    # @param [Hash] vocab: The vocabulary to be analyzed
    # @return [Hash] context: The wider context to be used as context source
    ###
    def filter_vocabulary_context(vocab, context)
      final_context = {}

      # We only have concepts at this point, so accessing the graph is fine.
      # Proceed to iterate through each concept in the graph
      vocab[:@graph].each do |concept|
        # Each concept will have different keys (here, the concepts are represented as hashes)
        # We iterate through each key of the concept, wich represents each "attribute"
        concept.keys.each do |attr_key|
          # We are only interested in those keys that uses the uris from the main context
          # If so, we add the key and value to our new context
          if using_context_uri(context, attr_key)
            k, v = context.find {|key, _value| key.include?(attr_key.split(":").first) }
            final_context[k] = v
          end
        end
      end

      final_context
    end
  end
end
