# frozen_string_literal: true

module Processors
  ###
  # @description: Process skos files and create skos concept schemes with its corresponding
  #   skos concepts as a graph
  ###
  class Skos
    ###
    # @param {Hash} data: The necessary data we need in order to create a concept scheme:
    #   - An organization
    #   - and an skos file in json-ld format
    ###
    def initialize data
      @name = data[:attrs][:name]
      @organization = data[:organization]
      @content = data[:attrs][:content]
      @parser = Parsers::Skos.new(file_content: @content)
    end

    ###
    # @description: Creates a concept scheme from a raw json content
    # @param {Hash} data: The necessary data we need in order to create a concept scheme:
    #   - An organization
    #   - and an skos file in json-ld format
    # @return {Vocabulary}: The created vocabulary
    ###
    def create
      @vocabulary = create_vocabulary

      @vocabulary.concepts = create_concepts(
        @parser.graph.select {|concept|
          Parsers::JsonLd::Node.new(concept).types.concept?
        }
      )

      @vocabulary
    end

    private

    ###
    # @description: Creates a single vocabulary. This should be in an skos format in the data[:raw] parameter
    # @return {Vocabulary}: The created vocabulary
    ###
    def create_vocabulary
      @vocabulary = Vocabulary.find_or_initialize_by(name: @name) do |vocab|
        vocab.update(
          organization: @organization,
          context: @parser.context,
          content: first_concept_scheme_node(@parser.graph)
        )
      end
    end

    ###
    # @description: Returns the first concept scheme in a graph. Useful for when we have a single
    #   vocabulary and need only the concept scheme node.
    # @param [Array] graph
    # @return [Hash]
    ###
    def first_concept_scheme_node graph
      graph.find {|concept|
        Parsers::JsonLd::Node.new(concept).read!("type").downcase.include?("conceptscheme")
      }
    end

    ###
    # @description: Create concepts for a given concept scheme
    # @param {Array} concepts_list: The raw array of data (array of objects) for the concepts
    # @return {Array}: The array of Concepts
    ###
    def create_concepts concepts_list
      concepts_list.map do |concept|
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
  end
end
