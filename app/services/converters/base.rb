# frozen_string_literal: true

module Converters
  # The parent class for the converters
  # @abstract
  class Base
    CONTEXT = {
      dct: "http://purl.org/dc/terms/",
      desm: "http://desmsolutions.org/ns/",
      rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
      rdfs: "http://www.w3.org/2000/01/rdf-schema#",
      skos: "http://www.w3.org/2004/02/skos/core#"
    }.freeze

    attr_reader :concept_scheme_cache, :domain_class_cache, :resources, :spec_id

    ##
    # @param file [#path]
    def initialize(_file)
      @concept_scheme_cache = {}
      @domain_class_cache = {}
      @resources = Set.new
      @spec_id = SecureRandom.hex
    end

    ##
    # Converts a file to the JSON-LD format.
    #
    # @param file [#path]
    # @return [Hash]
    def self.convert(file)
      {
        "@context": CONTEXT,
        "@graph": new(file).resources.to_a
      }
    end

    private

    def build_concept_scheme(*args)
      raise NotImplementedError
    end

    def build_domain_class(*args)
      raise NotImplementedError
    end

    ##
    # Builds a URI in the DESM namespace using the ID generated for the spec.
    #
    # @param value [String]
    # @return [String]
    def build_desm_uri(value)
      normalized_value = value.squish.gsub(/\W+/, "_")
      (Desm::DESM_NAMESPACE + "#{spec_id}/#{normalized_value}").to_s
    end

    ##
    # Returns the resource for a given entity from the cache.
    # Builds and caches a resource for the entity in the case of a cache miss.
    #
    # @param cache [Hash]
    # @param entity [Object]
    # @param builder [Method]
    # @param options [Hash]
    # @return [Hash, nil]
    def fetch_cached_resource(cache, entity, builder, **)
      resource = cache.fetch(entity, builder.call(entity, **))
      return unless resource

      resources << resource
      cache[entity] = resource
    end

    ##
    # Returns the concept scheme for a given entity from the cache.
    # Builds and caches a scheme for the entity in the case of a cache miss.
    #
    # @param entity [Object]
    # @param options [Hash]
    # @return [Hash, nil]
    def fetch_concept_scheme(entity, **)
      fetch_cached_resource(
        concept_scheme_cache,
        entity,
        method(:build_concept_scheme),
        **
      )
    end

    ##
    # Returns the domain class for a given entity from the cache.
    # Builds and caches a class for the entity in the case of a cache miss.
    #
    # @param entity [Object]
    # @param options [Hash]
    # @return [Hash]
    def fetch_domain_class(entity, **)
      fetch_cached_resource(
        domain_class_cache,
        entity,
        method(:build_domain_class),
        **
      )
    end
  end
end
