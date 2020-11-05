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
      ActiveRecord::Base.transaction do
        @vocabulary = create_vocabulary(data)

        @vocabulary.concepts = create_concepts(
          data[:attrs][:content]["@graph"].select {|concept| concept["type"].downcase == "skos:concept" }
        )
      end

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
      @vocabulary = Vocabulary.create!(
        name: data[:attrs][:name],
        organization: data[:organization],
        content: data[:attrs][:content]["@graph"].select {|concept| concept["type"].downcase == "skos:conceptscheme" }
      )
    end

    ###
    # @description: Create concepts for a given concept scheme
    # @param {Array} concepts_list: The raw array of data (array of objects) for the concepts
    # @return {Array}: The array of Concepts
    ###
    def self.create_concepts concepts_list
      concepts_list.map do |concept|
        SkosConcept.find_or_initialize_by(uri: Parsers::Specifications.read!(concept, "id")) do |skos_concept|
          skos_concept.update(raw: concept)
        end
      end
    end
  end
end
