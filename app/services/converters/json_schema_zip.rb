# frozen_string_literal: true

module Converters
  # Converts a ZIP archive containing JSON schemata to the JSON-LD format
  class JsonSchemaZip < Base
    IGNORED_PROPERTIES = %w(@context id type).freeze

    ##
    # @param file [#path]
    def initialize(file)
      super

      Dir.mktmpdir do |temp_dir|
        Zip::File.open(file.path) do |zip_file|
          zip_file.each do |f|
            path = File.join(temp_dir, f.name)
            zip_file.extract(f, path)
          end
        end

        SchemaTools.schema_path = temp_dir

        SchemaTools::Reader.read_all.each do |schema|
          build_object_resources(schema.absolute_filename, schema.to_h)
        end
      end
    end

    def self.read(path)
      Zip::File.open(path)
      true
    rescue Zip::Error
      raise Converters::ParseError
    end

    private

    ##
    # Builds an `skos:Concept` from an enumeration's value.
    #
    # @param value [String]
    # @param scheme_name [String]
    # @return [Hash]
    def build_concept(value, scheme_name)
      concept = {
        "@id": build_desm_uri("#{scheme_name}_#{value}"),
        "@type": "skos:Concept",
        "skos:prefLabel": value,
        "skos:definition": nil,
        "skos:inScheme": build_desm_uri(scheme_name)
      }

      resources << concept
      concept
    end

    ##
    # Builds an `skos:ConceptScheme` from a JSON property.
    #
    # @param name [String]
    # @param payload [Hash]
    # @return [Hash, nil]
    def build_concept_scheme(name, payload:)
      scheme_name = "#{name} Enumeration"

      values =
        if payload["type"] == "array"
          payload.dig("items", "properties")&.keys&.-(IGNORED_PROPERTIES)
        else
          payload["enum"]
        end

      return unless values&.any?

      concept_ids = values.map do |value|
        build_concept(value, scheme_name).fetch(:@id)
      end

      {
        "@id": build_desm_uri(scheme_name),
        "@type": "skos:ConceptScheme",
        "dct:title": scheme_name.decamelize,
        "dct:description": nil,
        "skos:hasTopConcept": concept_ids
      }
    end

    ##
    # Builds an `rdf:Class` for a given JSON object.
    #
    # @param key [String]
    # @param data [Hash]
    # @return [Hash]
    def build_domain_class(key, data:)
      {
        "@id": build_desm_uri(key.upcase_first),
        "@type": "rdf:Class",
        "rdfs:label": key.decamelize,
        "rdfs:comment": data["title"] || data["description"]
      }
    end

    ##
    # Builds RDF resources from a JSON object.
    #
    # @param pointer [String]
    # @param data [Hash]
    # @return [Hash] The `rdf:Class` created from the object
    def build_object_resources(pointer, data)
      key = File.basename(pointer, ".*")
      already_processed = domain_class_cache.key?(key)
      domain_class = fetch_domain_class(key, data:)

      unless already_processed
        definitions = data.fetch("definitions", [])
        properties = data.fetch("properties", [])

        [*definitions, *properties].each do |name, payload|
          build_property(name, payload, domain_class)
        end
      end

      domain_class
    end

    ##
    # Builds an `rdf:Property` and related resources from a JSON property.
    #
    # @param name [String]
    # @param payload [Hash]
    # @param domain_class [Hash]
    # @return [Hash]
    def build_property(name, payload, domain_class)
      return if IGNORED_PROPERTIES.include?(name)

      concept_scheme = fetch_concept_scheme(name, payload:)
      range = concept_scheme ? "skos:Concept" : derive_range(payload)

      property = {
        "@id": build_desm_uri(name.lowcase_first),
        "@type": "rdf:Property",
        "rdfs:label": name.decamelize,
        "rdfs:comment": payload["description"],
        "desm:sourcePath": payload[SchemaTools::Schema::PATH_KEY],
        "desm:valueSpace": concept_scheme&.slice(:@id),
        "rdfs:domain": domain_class.slice(:@id),
        "rdfs:range": range
      }

      resources << property
      property
    end

    ##
    # Derives an `rdfs:range` from a property.
    #
    # @param payload [Hash]
    # @return [String]
    def derive_range(payload)
      domain_class =
        if payload["type"] == "object"
          pointer = payload["$ref"]
          build_object_resources(pointer, payload) if pointer.present?
        end

      domain_class&.slice(:@id) || "rdfs:Literal"
    end
  end
end
