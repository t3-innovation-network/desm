# frozen_string_literal: true

module Processors
  ###
  # @description: Process skos files and create skos concept schemes with its corresponding
  #   skos concepts as a graph
  ###
  class Vocabularies < Skos
    def self.name_data_for(data, configuration_profile = nil)
      node = Parsers::Skos.new(graph: data[:@graph]).scheme_nodes.first.with_indifferent_access
      return {} unless node.present?

      node = Parsers::JsonLd::Node.new(node)
      name = node.read!("title") || node.read!("label")
      return { name:, name_with_version: name, version: 1 } if configuration_profile.nil?

      # If the vocabulary is already created, we can get the version from it
      vocab = configuration_profile.vocabularies.find_by(name:)
      return { name:, name_with_version: name, version: 1 } if vocab.nil?

      version = configuration_profile.vocabularies.where(name:).maximum(:version) + 1
      { name:, name_with_version: "#{name} (#{version})", version: }
    rescue StandardError
      {}
    end

    def create(name, configuration_profile)
      Vocabulary.with_advisory_lock("vocabularies_#{configuration_profile.id}") do
        @vocabulary = create_vocabulary(name, configuration_profile)
        @vocabulary.concepts = create_concepts
      end
      @vocabulary
    end

    def create_vocabulary(name, configuration_profile)
      # check if we already have a vocabulary with this name and if so create new one with incremented version
      version = 1
      if configuration_profile.vocabularies.exists?(name:)
        version = configuration_profile.vocabularies.where(name:).maximum(:version) + 1
      end

      # Create a new vocabulary with the given name and content
      @vocabulary = configuration_profile.vocabularies.find_or_initialize_by(name:, version:) do |vocab|
        vocab.assign_attributes(
          content: first_concept_scheme_node,
          context: @context || {}
        )
      end
      @vocabulary.save!
      @vocabulary
    end

    def create_concepts
      concept_nodes.map do |concept|
        SkosConcept.find_or_initialize_by(
          uri: Parsers::JsonLd::Node.new(concept).read!("id")
        ) do |c_concept|
          c_concept.update(
            raw: concept
          )
        end
      rescue StandardError => e
        Rails.logger.error(e.inspect)
        SkosConcept.find_by_uri(Parsers::JsonLd::Node.new(concept).read!("id"))
      end
    end

    def filter_vocabulary_context(vocab, context)
      final_context = {}

      # We only have concepts at this point, so accessing the graph is fine.
      # Proceed to iterate through each concept in the graph
      vocab[:@graph].each do |concept|
        # Each concept will have different keys (here, the concepts are represented as hashes)
        # We iterate through each key of the concept, wich represents each "attribute"
        concept.each_key do |attr_key|
          # We are only interested in those keys that uses the uris from the main context
          # If so, we add the key and value to our new context
          if using_context_uri(context, attr_key)
            k, v = context.find { |key, _value| key.include?(attr_key.split(":").first) }
            final_context[k] = v
          end
        end
      end

      final_context
    end
  end
end
